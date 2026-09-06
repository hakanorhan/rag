package com.example.aiservice.car;

import java.math.BigDecimal;

public record CarDTO(
        Long id,
        String brand,
        String model,
        String carType,
        BigDecimal dailyRate,
        Integer minimumAge,
        LocationDTO location,
        String imageUrl,
        String status
) {
}
