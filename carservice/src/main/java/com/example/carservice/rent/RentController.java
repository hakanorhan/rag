package com.example.carservice.rent;

import com.example.carservice.car.CarService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
public class RentController {

    private final CarService carService;

    @PutMapping("cars/{carId}/rentcar")
    public boolean rentCar(@PathVariable Long carId,
                           Authentication authentication) {
        return true;
    }
}
