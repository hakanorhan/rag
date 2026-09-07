package com.example.aiservice.car;

import java.time.Instant;
import java.util.List;

import org.jspecify.annotations.Nullable;

public record CarSearchResponse(
        List<CarDTO> cars,
        @Nullable Instant pickupAt,
        @Nullable Instant returnAt
) {
}
