package com.example.carservice.car;

import jakarta.validation.GroupSequence;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

@GroupSequence({
        CarSearchCriteria.class,
        PeriodValidation.class
}
)
/**
 * Supplied filter criteria
 * @param carCategory Car category
 * @param carType Car type
 * @param location @NotBlank location
 * @param pickupAt @NotNull rent start time
 * @param returnAt @NotNull rent end time
 */
public record CarSearchCriteria(
        String carCategory,
        String carType,
        @NotBlank(message = "Bitte geben Sie Standort ein.")
        String location,
        @NotNull(message = "Abholzeitpunkt darf nicht fehlen.")
        Instant pickupAt,
        @NotNull(message = "Rückgabezeitpunkt darf nicht fehlen.")
        Instant returnAt
) {

    @AssertTrue(
            message = "Abhol- und Rückgabezeitraum ist ungültig",
            groups = PeriodValidation.class)
    public boolean isPeriodValid() {
        return (pickupAt.isBefore(returnAt));
    }
}
