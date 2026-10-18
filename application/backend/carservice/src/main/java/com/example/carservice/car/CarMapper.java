package com.example.carservice.car;

import com.example.carservice.location.LocationMapper;

import com.example.commonlib.car.CarDTO;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class CarMapper {

    public static CarDTO toDTO(Car car) {
        return new CarDTO(
                car.getId(),
                car.getCarCategory(),
                car.getCarType().getName(),
                car.getCarType().getDailyRate(),
                car.getCarType().getMinimumAge(),
                LocationMapper.toDTO(car.getLocation()),
                car.getImageUrl(),
                car.getStatus()
        );
    }
}
