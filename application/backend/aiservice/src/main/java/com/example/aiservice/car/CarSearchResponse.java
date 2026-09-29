package com.example.aiservice.car;

import java.time.Instant;
import java.util.List;

import com.example.commonlib.car.CarDTO;

import org.jspecify.annotations.Nullable;

public record CarSearchResponse(
        List<CarDTO> cars,
        @Nullable String pickupLocation,
        @Nullable String returnLocation,
        @Nullable Instant pickupAt,
        @Nullable Instant returnAt,
        String searchQuery
) {
}
