package com.example.carservice.car;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.commonlib.car.LocationDTO;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
public class LocationController {

    private final LocationService locationService;

    @GetMapping("/locations")
    public List<LocationDTO> allLocations() {
        return locationService.allLocations();
    }
}
