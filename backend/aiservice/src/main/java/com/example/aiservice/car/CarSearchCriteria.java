package com.example.aiservice.car;

import java.time.Instant;

import org.jspecify.annotations.Nullable;

public record CarSearchCriteria(
        @Nullable String carCategory,
        @Nullable String carType,
        @Nullable String location,
        @Nullable String returnLocation,
        @Nullable Instant pickupAt,
        @Nullable Instant returnAt
) {
}
