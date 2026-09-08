package com.example.carservice.car;

import java.time.Instant;
import java.util.List;
import java.util.Locale;

import com.example.carservice.shared.CarSearchCriteria;
import com.example.carservice.shared.FreeTextCarSearchCriteria;
import com.example.commonlib.car.CarDTO;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class CarService {

    private final CarRepository carRepository;

    public List<CarDTO> getAllCars() {
        return toDTOs(carRepository.findAllBy());
    }

    public List<CarDTO> search(CarSearchCriteria criteria) {
        log.info("CarService.class pickupAt={}, returnAt={}", criteria.pickupAt(), criteria.returnAt());
        return search(
                criteria.brand(),
                criteria.model(),
                criteria.carType(),
                criteria.location(),
                true,
                criteria.pickupAt(),
                criteria.returnAt()
        );
    }

    public List<CarDTO> searchFreeText(FreeTextCarSearchCriteria criteria) {
        boolean hasPeriod = criteria.pickupAt() != null;
        return search(
                normalizeBrand(criteria.brand()),
                optional(criteria.model()),
                optional(criteria.carType()),
                optional(criteria.location()),
                hasPeriod,
                criteria.pickupAt(),
                criteria.returnAt()
        );
    }

    private String optional(String value) {
        return value == null || value.isBlank() ? null : value.strip();
    }

    private String normalizeBrand(String brand) {
        String value = optional(brand);
        if (value == null) {
            return null;
        }

        return switch (value.toLowerCase(Locale.ROOT)) {
            case "skoda", "škoda" -> "Škoda";
            case "vw", "volkswagen" -> "Volkswagen";
            default -> value;
        };
    }

    private List<CarDTO> search(String brand, String model, String carType, String location,
            boolean hasPeriod, Instant pickupAt, Instant returnAt) {
        return toDTOs(carRepository.search(
                brand,
                model,
                carType,
                location,
                hasPeriod,
                pickupAt,
                returnAt
        ));
    }

    private List<CarDTO> toDTOs(List<Car> cars) {
        return cars
                .stream()
                .map(CarMapper::toDTO)
                .toList();
    }
}
