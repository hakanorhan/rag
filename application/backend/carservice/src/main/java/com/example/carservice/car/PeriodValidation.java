package com.example.carservice.car;

import java.time.Duration;
import java.time.Instant;

public interface PeriodValidation {
    long MIN_RENTAL_DURATION_HOURS = 2;

    static boolean isValid(Instant pickupAt, Instant returnAt) {
        return pickupAt != null
                && returnAt != null
                && pickupAt.isAfter(Instant.now())
                && Duration.between(pickupAt, returnAt).toHours() >= MIN_RENTAL_DURATION_HOURS;
    }
}
