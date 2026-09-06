package com.example.carservice.shared;

import java.math.BigDecimal;

import com.example.carservice.car.CarStatus;

public record CarDTO(
        Long id,
        String brand,
        String model,
        String carType,
        BigDecimal dailyRate,
        Integer minimumAge,
        LocationDTO location,
        String imageUrl,
        CarStatus status
) {
}
