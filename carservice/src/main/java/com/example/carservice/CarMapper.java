package com.example.carservice;

import com.example.carservice.dtos.CarDTO;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class CarMapper {

    public static CarDTO toDTO(Car car) {
        return new CarDTO(
                car.getBrand(),
                car.getModel(),
                car.getPrice()
        );
    }
}
