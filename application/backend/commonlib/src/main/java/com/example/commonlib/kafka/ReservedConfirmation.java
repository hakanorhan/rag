package com.example.commonlib.kafka;

public record ReservedConfirmation(
        Long reservationId,
        String recipient
) {
    public static final String TOPIC = "reserved-topic";
}
