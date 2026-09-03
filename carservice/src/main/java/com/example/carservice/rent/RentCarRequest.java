package com.example.carservice.rent;

import java.math.BigDecimal;
import java.time.Instant;

import com.example.carservice.car.CarStatus;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RentCarRequest(
        @NotBlank(message = "Abholort darf nicht fehlen.")
        String location,
        @NotNull(message = "Abholzeitpunkt darf nicht fehlen.")
        Instant pickupAt,
        @NotNull(message = "Rückgabezeitpunkt darf nicht fehlen.")
        Instant returnAt,
        @NotNull(message = "Tagespreis darf nicht fehlen.")
        @DecimalMin(value = "0.0", inclusive = false, message = "Tagespreis muss größer als 0 sein.")
        BigDecimal dailyRate,
        @NotNull(message = "Fahrzeugstatus darf nicht fehlen.")
        CarStatus status
) {

    @AssertTrue(message = "Abhol- und Rückgabezeitraum ist ungültig.")
    public boolean isPeriodValid() {
        return pickupAt == null || returnAt == null || pickupAt.isBefore(returnAt);
    }
}
