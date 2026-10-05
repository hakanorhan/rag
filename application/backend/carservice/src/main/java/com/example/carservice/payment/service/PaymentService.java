package com.example.carservice.payment.service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import com.example.carservice.car.ReservationStatus;
import com.example.carservice.payment.entity.Payment;
import com.example.carservice.payment.entity.PaymentStatus;
import com.example.carservice.payment.paypal.PaypalGateway;
import com.example.carservice.payment.repository.PaymentRepository;
import com.example.carservice.reservation.Reservation;
import com.example.carservice.reservation.ReservationError;
import com.example.carservice.reservation.ReservationException;
import com.example.carservice.reservation.ReservationRepository;
import com.example.commonlib.kafka.PaidConfirmation;
import com.paypal.sdk.models.CaptureStatus;
import com.paypal.sdk.models.Order;
import com.paypal.sdk.models.OrderStatus;
import com.paypal.sdk.models.OrdersCapture;
import com.paypal.sdk.models.PurchaseUnit;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PaymentService {

    private final ReservationRepository reservations;
    private final PaymentRepository payments;
    private final PaypalGateway paypal;
    private final ApplicationEventPublisher eventPublisher;
    private final EntityManager entityManager;

    public PaymentService(ReservationRepository reservations, PaymentRepository payments,
                          PaypalGateway paypal, ApplicationEventPublisher eventPublisher,
                          EntityManager entityManager) {
        this.reservations = reservations;
        this.payments = payments;
        this.paypal = paypal;
        this.eventPublisher = eventPublisher;
        this.entityManager = entityManager;
    }

    @Transactional
    public boolean isPaid(Long reservationId, String keycloakId) {
        Reservation reservation = ownedReservation(reservationId, keycloakId);
        if (payments.existsByReservationIdAndStatus(reservationId, PaymentStatus.COMPLETED)) return true;
        for (Payment payment : payments.findByReservationId(reservationId)) {
            if (payment.getStatus() != PaymentStatus.PENDING) continue;
            Order order = paypal.getOrder(payment.getProviderReference());
            if (payment.getAmount().compareTo(reservation.getTotalPrice()) == 0
                    && captureStatus(order, payment) == CaptureStatus.COMPLETED) {
                completePayment(payment, reservation, order);
                return true;
            }
        }
        return false;
    }

    @Transactional
    public String createPaymentForPayPal(Long reservationId, String keycloakId) {
        Reservation reservation = ownedReservation(reservationId, keycloakId);
        if (reservation.getStatus() != ReservationStatus.RESERVED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "PAYMENT_CONFLICT");
        }
        if (payments.existsByReservationIdAndStatus(reservationId, PaymentStatus.COMPLETED)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "PAYMENT_CONFLICT");
        }
        BigDecimal amount = reservation.getTotalPrice();
        if (amount == null || amount.signum() <= 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "PAYMENT_CONFLICT");
        }

        for (Payment pending : payments.findByReservationId(reservationId)) {
            if (pending.getStatus() != PaymentStatus.PENDING) continue;
            Order existing = paypal.getOrder(pending.getProviderReference());
            if (existing != null && existing.getStatus() == OrderStatus.COMPLETED) {
                CaptureStatus capture = captureStatus(existing, pending);
                if (capture == CaptureStatus.PENDING) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "PAYMENT_PENDING");
                }
                if (capture != CaptureStatus.DECLINED && capture != CaptureStatus.FAILED) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "PAYMENT_CONFLICT");
                }
            }
            pending.fail();
        }

        String transactionId = UUID.randomUUID().toString();
        String orderId = paypal.createOrder(reservationId, amount, transactionId);
        Payment payment = new Payment();
        payment.setTransactionId(transactionId);
        payment.setReservationId(reservationId);
        payment.setAmount(amount);
        payment.setCurrency("EUR");
        payment.setProviderReference(orderId);
        payments.save(payment);
        return orderId;
    }

    @Transactional
    public PaymentStatus completePaymentByProviderReference(String orderId, String keycloakId) {
        Payment payment = payments.findByProviderReference(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ORDER_NOT_FOUND"));
        Reservation reservation = ownedReservation(payment.getReservationId(), keycloakId);
        // The reservation lock serializes capture with option edits and concurrent payment requests.
        entityManager.refresh(payment);
        if (payment.getStatus() == PaymentStatus.COMPLETED) return PaymentStatus.COMPLETED;
        if (payment.getStatus() != PaymentStatus.PENDING
                || reservation.getStatus() != ReservationStatus.RESERVED
                || reservation.getTotalPrice().compareTo(payment.getAmount()) != 0
                || payments.existsByReservationIdAndStatus(reservation.getId(), PaymentStatus.COMPLETED)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "PAYMENT_CONFLICT");
        }

        Order order = paypal.captureOrder(orderId, payment.getTransactionId());
        CaptureStatus capture = captureStatus(order, payment);
        if (capture == CaptureStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "PAYMENT_PENDING");
        }
        if (capture != CaptureStatus.COMPLETED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "PAYMENT_DECLINED");
        }
        completePayment(payment, reservation, order);
        return PaymentStatus.COMPLETED;
    }

    private void completePayment(Payment payment, Reservation reservation, Order order) {
        payment.complete();
        payments.save(payment);
        String capturedAt = order.getPurchaseUnits().getFirst().getPayments().getCaptures().getFirst().getCreateTime();
        eventPublisher.publishEvent(new PaidConfirmation(
                reservation.getId(), payment.getId(), reservation.getUser().getEmail(),
                reservation.getCar().getCarCategory(), reservation.getPickupAt(), reservation.getReturnAt(),
                payment.getAmount(), payment.getCurrency(), capturedAt == null ? Instant.now() : Instant.parse(capturedAt)
        ));
    }

    private Reservation ownedReservation(Long reservationId, String keycloakId) {
        return reservations.findOwnedForUpdate(reservationId, keycloakId)
                .orElseThrow(() -> new ReservationException(ReservationError.RESERVATION_NOT_FOUND));
    }

    private CaptureStatus captureStatus(Order order, Payment payment) {
        if (order == null || !payment.getProviderReference().equals(order.getId())
                || order.getStatus() != OrderStatus.COMPLETED
                || order.getPurchaseUnits() == null || order.getPurchaseUnits().size() != 1) {
            return null;
        }
        PurchaseUnit unit = order.getPurchaseUnits().getFirst();
        if (unit.getPayments() == null || unit.getPayments().getCaptures() == null
                || unit.getPayments().getCaptures().size() != 1) return null;
        OrdersCapture capture = unit.getPayments().getCaptures().getFirst();
        if (capture.getAmount() == null
                || !payment.getCurrency().equals(capture.getAmount().getCurrencyCode())
                || new BigDecimal(capture.getAmount().getValue()).compareTo(payment.getAmount()) != 0) return null;
        return capture.getStatus();
    }
}
