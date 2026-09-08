package com.example.carservice.ai;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RestController;

import com.example.carservice.car.CarService;
import com.example.carservice.shared.CarSearchCriteria;
import com.example.carservice.shared.FreeTextCarSearchCriteria;
import com.example.commonlib.car.CarDTO;

import jakarta.validation.Valid;

@RestController
@RequiredArgsConstructor
public class CarSearchController {

    private final CarService carService;

    @GetMapping("/cars")
    public List<CarDTO> getAllCars() {
        return carService.getAllCars();
    }

    /**
     * Searches for cars matching the supplied filter criteria.
     *
     * @param criteria the filters and optional rental period
     * @return the matching cars
     */
    @GetMapping("/cars/search")
    public List<CarDTO> search(@Valid @ModelAttribute CarSearchCriteria criteria) {
        return carService.search(criteria);
    }

    @GetMapping("/cars/search/free-text")
    public List<CarDTO> searchFreeText(@Valid @ModelAttribute FreeTextCarSearchCriteria criteria) {
        return carService.searchFreeText(criteria);
    }
}
