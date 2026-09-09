package com.example.carservice.car;

import java.time.Instant;

import jakarta.validation.constraints.AssertTrue;

/**
 * Optional filters extracted from a free-text search.
 */
public record FreeTextCarSearchCriteria(
        String brand,
        String model,
        String carType,
        String location,
        Instant pickupAt,
        Instant returnAt
) {

    @AssertTrue(message = "Abhol- und Rückgabezeitraum müssen gemeinsam angegeben und gültig sein")
    public boolean isPeriodValid() {
        if (pickupAt == null || returnAt == null) {
            return pickupAt == null && returnAt == null;
        }
        return pickupAt.isBefore(returnAt);
    }
}
