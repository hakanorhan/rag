package com.example.carservice;

import com.example.carservice.dtos.CarDTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CarService {

    private final CarRepository carRepository;

    public List<CarDTO> allCars() {
        return carRepository.findAll()
                .stream()
                .map(CarMapper::toDTO)
                .toList();
    }
}
