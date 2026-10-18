package com.example.carservice.payment.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import com.example.carservice.car.Car;
import com.example.carservice.reservation.ReservationStatus;
import com.example.carservice.user.User;
import com.example.carservice.payment.entity.Payment;
import com.example.carservice.payment.entity.PaymentStatus;
import com.example.carservice.payment.paypal.PaypalGateway;
import com.example.carservice.payment.repository.PaymentRepository;
import com.example.carservice.reservation.Reservation;
import com.example.carservice.reservation.ReservationRepository;
import com.example.commonlib.kafka.PaidConfirmation;
import com.paypal.sdk.models.CaptureStatus;
import com.paypal.sdk.models.Money;
import com.paypal.sdk.models.Order;
import com.paypal.sdk.models.OrderStatus;
import com.paypal.sdk.models.OrdersCapture;
import com.paypal.sdk.models.PaymentCollection;
import com.paypal.sdk.models.PurchaseUnit;

import jakarta.persistence.EntityManager;
import org.springframework.context.ApplicationEventPublisher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    ReservationRepository reservations;

    @Mock
    PaymentRepository payments;

    @Mock
    PaypalGateway paypal;

    @Mock
    ApplicationEventPublisher eventPublisher;

    @Mock
    EntityManager entityManager;

    @InjectMocks
    PaymentService paymentService;

    private Reservation reservation;
    private Payment payment;

    @BeforeEach
    void setUp() {
        User user = new User();
        user.setEmail("owner@example.com");
        Car car = new Car();
        car.setCarCategory("Premium Cabrio");
        reservation = new Reservation();
        reservation.setId(1L);
        reservation.setUser(user);
        reservation.setCar(car);
        reservation.setStatus(ReservationStatus.RESERVED);
        reservation.setTotalPrice(new BigDecimal("149.90"));
        reservation.setPickupAt(Instant.parse("2035-09-10T10:00:00Z"));
        reservation.setReturnAt(Instant.parse("2035-09-11T10:00:00Z"));
        when(reservations.findOwnedForUpdate(1L, "owner")).thenReturn(Optional.of(reservation));

        payment = new Payment();
        payment.setId(2L);
        payment.setReservationId(1L);
        payment.setAmount(reservation.getTotalPrice());
        payment.setProviderReference("ORDER-123");
        payment.setTransactionId("transaction-123");
    }

    @Test
    void shouldSaveNewPaymentAsPending() {
        when(payments.findByReservationId(1L)).thenReturn(List.of());
        when(paypal.createOrder(eq(1L), eq(reservation.getTotalPrice()), anyString())).thenReturn("ORDER-123");

        String orderId = paymentService.createPaymentForPayPal(1L, "owner");

        assertThat(orderId).isEqualTo("ORDER-123");
        ArgumentCaptor<Payment> captor = ArgumentCaptor.forClass(Payment.class);
        verify(payments).save(captor.capture());
        Payment payment = captor.getValue();
        assertThat(payment.getReservationId()).isEqualTo(1L);
        assertThat(payment.getAmount()).isEqualByComparingTo("149.90");
        assertThat(payment.getCurrency()).isEqualTo("EUR");
        assertThat(payment.getProviderReference()).isEqualTo("ORDER-123");
        assertThat(payment.getStatus()).isEqualTo(PaymentStatus.PENDING);
    }

    @Test
    void shouldCompletePendingPaymentOnlyOnce() {
        when(payments.findByProviderReference("ORDER-123")).thenReturn(Optional.of(payment));
        when(paypal.captureOrder("ORDER-123", "transaction-123"))
                .thenReturn(confirmedOrder());

        assertThat(paymentService.completePaymentByProviderReference("ORDER-123", "owner"))
                .isEqualTo(PaymentStatus.COMPLETED);
        assertThat(payment.getStatus()).isEqualTo(PaymentStatus.COMPLETED);

        assertThat(paymentService.completePaymentByProviderReference("ORDER-123", "owner"))
                .isEqualTo(PaymentStatus.COMPLETED);

        verify(paypal).captureOrder("ORDER-123", "transaction-123");
        verify(payments).save(payment);
        verify(eventPublisher).publishEvent(any(PaidConfirmation.class));
    }

    @Test
    void shouldUpdateLocalPaymentAfterConfirmedPaymentIsFound() {
        when(payments.findByReservationId(1L)).thenReturn(List.of(payment));
        when(paypal.getOrder("ORDER-123")).thenReturn(confirmedOrder());

        assertThat(paymentService.isPaid(1L, "owner")).isTrue();
        assertThat(payment.getStatus()).isEqualTo(PaymentStatus.COMPLETED);
        verify(payments).save(payment);
        verify(eventPublisher).publishEvent(any(PaidConfirmation.class));
    }

    @Test
    void shouldKeepLocalPaymentPendingWhenProviderFails() {
        when(payments.findByProviderReference("ORDER-123")).thenReturn(Optional.of(payment));
        when(paypal.captureOrder("ORDER-123", "transaction-123"))
                .thenThrow(new IllegalStateException("Provider unavailable"));

        assertThatThrownBy(() -> paymentService.completePaymentByProviderReference("ORDER-123", "owner"))
                .isInstanceOf(IllegalStateException.class);

        assertThat(payment.getStatus()).isEqualTo(PaymentStatus.PENDING);
        verify(payments, never()).save(any());
        verifyNoInteractions(eventPublisher);
    }

    @Test
    void shouldReplaceUnfinishedPaymentWithNewPendingPayment() {
        Order unfinishedOrder = new Order();
        unfinishedOrder.setStatus(OrderStatus.CREATED);
        when(payments.findByReservationId(1L)).thenReturn(List.of(payment));
        when(paypal.getOrder("ORDER-123")).thenReturn(unfinishedOrder);
        when(paypal.createOrder(eq(1L), eq(reservation.getTotalPrice()), anyString())).thenReturn("ORDER-456");

        assertThat(paymentService.createPaymentForPayPal(1L, "owner")).isEqualTo("ORDER-456");

        assertThat(payment.getStatus()).isEqualTo(PaymentStatus.FAILED);
        ArgumentCaptor<Payment> captor = ArgumentCaptor.forClass(Payment.class);
        verify(payments).save(captor.capture());
        assertThat(captor.getValue().getStatus()).isEqualTo(PaymentStatus.PENDING);
        assertThat(captor.getValue().getProviderReference()).isEqualTo("ORDER-456");
        assertThat(captor.getValue().getTransactionId()).isNotEqualTo(payment.getTransactionId());
        verifyNoInteractions(eventPublisher);
    }

    @Test
    void shouldRejectCaptureOfFailedPayment() {
        payment.fail();
        when(payments.findByProviderReference("ORDER-123")).thenReturn(Optional.of(payment));

        assertConflict(() -> paymentService.completePaymentByProviderReference("ORDER-123", "owner"),
                "PAYMENT_CONFLICT");

        assertThat(payment.getStatus()).isEqualTo(PaymentStatus.FAILED);
        verifyNoInteractions(paypal, eventPublisher);
    }

    @ParameterizedTest
    @EnumSource(value = ReservationStatus.class, names = {"ACTIVE", "COMPLETED", "CANCELLED"})
    void shouldRejectPaymentForNonReservedReservation(ReservationStatus status) {
        reservation.setStatus(status);
        when(payments.findByProviderReference("ORDER-123")).thenReturn(Optional.of(payment));

        assertConflict(() -> paymentService.createPaymentForPayPal(1L, "owner"), "PAYMENT_CONFLICT");
        assertConflict(() -> paymentService.completePaymentByProviderReference("ORDER-123", "owner"),
                "PAYMENT_CONFLICT");

        assertThat(payment.getStatus()).isEqualTo(PaymentStatus.PENDING);
        assertThat(reservation.getStatus()).isEqualTo(status);
        verifyNoInteractions(paypal, eventPublisher);
    }

    @Test
    void shouldRejectNewPaymentForAlreadyPaidReservation() {
        when(payments.existsByReservationIdAndStatus(1L, PaymentStatus.COMPLETED)).thenReturn(true);

        assertConflict(() -> paymentService.createPaymentForPayPal(1L, "owner"), "PAYMENT_CONFLICT");

        verifyNoInteractions(paypal, eventPublisher);
    }

    private Order confirmedOrder() {
        Money amount = new Money();
        amount.setCurrencyCode("EUR");
        amount.setValue("149.90");
        OrdersCapture capture = new OrdersCapture();
        capture.setStatus(CaptureStatus.COMPLETED);
        capture.setAmount(amount);
        PaymentCollection collection = new PaymentCollection();
        collection.setCaptures(List.of(capture));
        PurchaseUnit unit = new PurchaseUnit();
        unit.setPayments(collection);
        Order order = new Order();
        order.setId("ORDER-123");
        order.setStatus(OrderStatus.COMPLETED);
        order.setPurchaseUnits(List.of(unit));
        return order;
    }

    private void assertConflict(Runnable action, String reason) {
        assertThatThrownBy(action::run).isInstanceOfSatisfying(ResponseStatusException.class, exception -> {
            assertThat(exception.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
            assertThat(exception.getReason()).isEqualTo(reason);
        });
    }
}
