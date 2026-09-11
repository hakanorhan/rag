package com.example.carservice.reservation;

import java.time.Instant;
import java.util.Set;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record ReservationCarRequest(
        @NotNull(message = "Bitte wählen Sie erneut ein Fahrzeug.")
        Long carId,
        @NotNull(message = "Abholort darf nicht fehlen.")
        Long pickUpLocationId,
        @NotNull(message = "Rückgabeort darf nicht fehlen.")
        Long returnLocationId,
        @NotNull(message = "Abholzeitpunkt darf nicht fehlen.")
        @Future(message = "Abholzeitpunkt muss in der Zukunft liegen.")
        Instant pickupAt,
        @NotNull(message = "Rückgabezeitpunkt darf nicht fehlen.")
        @Future(message = "Rückgabezeitpunkt muss in der Zukunft liegen.")
        Instant returnAt,
        @Positive Long mileagePackageId,
        @Size(max = 20) Set<@NotNull @Positive Long> extraIds,
        @Size(max = 500) String searchQuery
) {

    public ReservationCarRequest(
            Long carId,
            Long pickUpLocationId,
            Long returnLocationId,
            Instant pickupAt,
            Instant returnAt,
            String searchQuery
    ) {
        this(carId, pickUpLocationId, returnLocationId, pickupAt, returnAt, 1L, Set.of(), searchQuery);
    }

    public ReservationCarRequest {
        if (mileagePackageId == null) mileagePackageId = 1L;
        if (extraIds == null) extraIds = Set.of();
    }

    @AssertTrue(message = "Abhol- oder Rückgabezeitraum ist ungültig.")
    public boolean isPeriodValid() {
        return pickupAt == null || returnAt == null || pickupAt.isBefore(returnAt);
    }
}
