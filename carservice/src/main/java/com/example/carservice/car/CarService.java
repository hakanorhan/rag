package com.example.carservice.car;

import java.time.Instant;
import java.util.List;

import com.example.carservice.shared.CarDTO;
import com.example.carservice.shared.CarSearchCriteria;
import com.example.carservice.shared.FreeTextCarSearchCriteria;
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
                criteria.brand(),
                criteria.model(),
                criteria.carType(),
                criteria.location(),
                hasPeriod,
                criteria.pickupAt(),
                criteria.returnAt()
        );
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
