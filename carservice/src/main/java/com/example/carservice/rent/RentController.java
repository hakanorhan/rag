package com.example.carservice.rent;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.carservice.car.CarService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
public class RentController {

    private final CarService carService;

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/cars/{carId}/rentcar")
    public boolean rentCar(
            @PathVariable Long carId,
            @Valid @RequestBody RentCarRequest request,
            Authentication authentication
    ) {
        return true;
    }
}