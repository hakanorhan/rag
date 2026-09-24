package com.example.carservice.payment.repository;

import com.example.carservice.payment.entity.Payment;
import com.example.carservice.payment.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByReservationId(Long reservationId);

    Optional<Payment> findByProviderReference(String providerReference);

    boolean existsByReservationIdAndStatus(Long reservationId, PaymentStatus status);
}
