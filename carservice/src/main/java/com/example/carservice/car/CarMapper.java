package com.example.carservice.car;

import com.example.carservice.shared.CarDTO;
import com.example.carservice.shared.LocationDTO;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class CarMapper {

    public static CarDTO toDTO(Car car) {
        return new CarDTO(
                car.getId(),
                car.getBrand(),
                car.getModel(),
                car.getCarType().getName(),
                car.getCarType().getDailyRate(),
                car.getCarType().getMinimumAge(),
                new LocationDTO(car.getLocation().getId(), car.getLocation().getName()),
                car.getImageUrl(),
                car.getStatus()
        );
    }
}
