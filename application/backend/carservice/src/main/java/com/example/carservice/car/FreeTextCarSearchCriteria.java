package com.example.carservice.car;

import java.time.Instant;

import jakarta.validation.constraints.AssertTrue;

/**
 * Optional filters extracted from a free-text search.
 */
public record FreeTextCarSearchCriteria(
        String carCategory,
        String carType,
        String location,
        Instant pickupAt,
        Instant returnAt
) {

    @AssertTrue(message = "Der Abhol- und Rückgabezeitraum muss gültig sein")
    public boolean isPeriodValid() {
        if (pickupAt == null || returnAt == null) {
            return true;
        }
        return PeriodValidation.isValid(pickupAt, returnAt);
    }
}
