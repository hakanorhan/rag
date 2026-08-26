package com.example.carservice;

import com.example.carservice.dtos.CarDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
@Transactional
class CarServiceTest {

    private final CarService carService;

    @Autowired
    public CarServiceTest(CarService carService) {
        this.carService = carService;
    }

    @Test
    @Sql("/cars.sql")
    void allCars() {
        List<CarDTO> allCars = carService.allCars();

        assertEquals(2, allCars.size());
    }
}