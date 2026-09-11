package com.example.commonlib.car;

import java.math.BigDecimal;

public record CarDTO(
        Long id,
        String carCategory,
        String carType,
        BigDecimal dailyRate,
        Integer minimumAge,
        LocationDTO location,
        String imageUrl,
        CarStatus status
) {
}
