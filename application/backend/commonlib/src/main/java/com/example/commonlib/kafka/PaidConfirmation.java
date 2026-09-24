package com.example.commonlib.kafka;

import java.math.BigDecimal;
import java.time.Instant;

public record PaidConfirmation(
        Long reservationId,
        Long paymentId,
        String recipient,
        String carCategory,
        Instant pickupAt,
        Instant returnAt,
        BigDecimal amount,
        String currency,
        Instant paidAt
) {
    public static final String TOPIC = "paid-topic";
}
