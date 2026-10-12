package com.example.carservice.car;

import java.util.List;

import com.example.commonlib.car.CarDTO;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/cars")
public class CarSearchController {

    private final CarService carService;

    @GetMapping
    public List<CarDTO> getAllCars() {
        return carService.getAllCars();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarDTO> getCar(@PathVariable Long id) {
        return ResponseEntity.of(carService.getCar(id));
    }

    /**
     * Searches for cars matching the supplied filter criteria.
     *
     * @param criteria the filters and optional rental period
     * @return the matching cars
     */
    @GetMapping("/search")
    public List<CarDTO> search(@Valid @ModelAttribute CarSearchCriteria criteria) {
        return carService.search(criteria);
    }

    @GetMapping("/search/free-text")
    public List<CarDTO> searchFreeText(@Valid @ModelAttribute FreeTextCarSearchCriteria criteria) {
        return carService.searchFreeText(criteria);
    }
}
