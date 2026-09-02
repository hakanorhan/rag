package com.example.aiservice.car;

import java.time.Instant;

import org.jspecify.annotations.Nullable;

public record CarSearchCriteria(
        @Nullable String brand,
        @Nullable String model,
        @Nullable String carType,
        @Nullable String location,
        @Nullable Instant pickupAt,
        @Nullable Instant returnAt
) {
}
