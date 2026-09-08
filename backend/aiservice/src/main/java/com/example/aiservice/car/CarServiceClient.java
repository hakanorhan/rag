package com.example.aiservice.car;

import java.util.List;

import com.example.commonlib.car.CarDTO;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;

public interface CarServiceClient {

    @GetExchange("/cars/search/free-text")
    List<CarDTO> search(
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String model,
            @RequestParam(required = false) String carType,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String pickupAt,
            @RequestParam(required = false) String returnAt
    );
}
