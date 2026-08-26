package com.example.carservice;

import com.example.carservice.dtos.CarDTO;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
public class CarController {

    private final CarService carService;

    @GetMapping("/all-cars")
    public List<CarDTO> allCars() {
        return carService.allCars();
    }
}
