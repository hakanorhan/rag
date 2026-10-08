package com.example.carservice.car;

import java.time.Instant;
import java.util.List;

import com.example.commonlib.car.CarDTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CarService {

    private final CarRepository carRepository;

    public List<CarDTO> getAllCars() {
        return toDTOs(carRepository.findAllBy());
    }

    public List<CarDTO> search(CarSearchCriteria criteria) {
        return search(
                criteria.carCategory(),
                criteria.carType(),
                criteria.location(),
                criteria.pickupAt(),
                criteria.returnAt()
        );
    }

    public List<CarDTO> searchFreeText(FreeTextCarSearchCriteria criteria) {
        return search(
                optional(criteria.carCategory()),
                optional(criteria.carType()),
                optional(criteria.location()),
                criteria.pickupAt(),
                criteria.returnAt()
        );
    }

    private String optional(String value) {
        return value == null || value.isBlank() ? null : value.strip();
    }

    private List<CarDTO> search(String carCategory, String carType, String location,
            Instant pickupAt, Instant returnAt) {
        boolean hasPeriod = pickupAt != null && returnAt != null;
        return toDTOs(carRepository.search(
                carCategory,
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
