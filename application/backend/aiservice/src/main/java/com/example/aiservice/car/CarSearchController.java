package com.example.aiservice.car;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai/cars/search")
public class CarSearchController {

    private final CarSearchService carSearchService;

    public CarSearchController(CarSearchService carSearchService) {
        this.carSearchService = carSearchService;
    }

    @PostMapping
    public CarSearchResponse search(@Valid @RequestBody CarSearchRequest request) {
        return carSearchService.search(request.message());
    }

    public record CarSearchRequest(@NotBlank String message) {
    }
}
