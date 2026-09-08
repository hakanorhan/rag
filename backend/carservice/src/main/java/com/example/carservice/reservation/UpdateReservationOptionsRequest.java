package com.example.carservice.reservation;

import java.util.Set;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record UpdateReservationOptionsRequest(
        @NotNull @Positive Long mileagePackageId,
        @NotNull @Size(max = 20) Set<@NotNull @Positive Long> extraIds
) {}
