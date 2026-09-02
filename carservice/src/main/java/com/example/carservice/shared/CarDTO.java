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
        String location,
        String imageUrl,
        CarStatus status
) {
}
