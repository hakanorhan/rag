package com.example.aiservice.car;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

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

    @GetMapping("/{searchId}")
    public CarSearchResponse searchById(@PathVariable String searchId) {
        CarSearchResponse response = carSearchService.findById(searchId);
        if (response == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Suchergebnis ist abgelaufen");
        }
        return response;
    }

    public record CarSearchRequest(@NotBlank String message) {
    }
}
