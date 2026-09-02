package com.example.carservice.car;

import com.example.carservice.shared.CarDTO;
import com.example.carservice.shared.CarSearchCriteria;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class CarService {

    private final CarRepository carRepository;

    public List<CarDTO> allCars() {
        return toDTOs(carRepository.findAllBy());
    }


    public List<CarDTO> search(CarSearchCriteria criteria) {
        log.info("CarService.class pickupAt={}, returnAt={}", criteria.pickupAt(), criteria.returnAt());
        return toDTOs(carRepository.search(
                criteria.brand(),
                criteria.model(),
                criteria.carType(),
                criteria.location(),
                criteria.hasPeriod(),
                criteria.pickupAt(),
                criteria.returnAt()
        ));
    }

    private List<CarDTO> toDTOs(List<Car> cars) {
        return cars
                .stream()
                .map(CarMapper::toDTO)
                .toList();
    }
}
