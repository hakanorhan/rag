package com.example.carservice.car;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.commonlib.car.LocationDTO;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class LocationService {

    private final LocationRepository repository;

    public List<LocationDTO> allLocations() {
        return repository.findAll().stream()
                .map(location -> new LocationDTO(location.getId(), location.getName()))
                .toList();
    }
}
