package com.example.carservice.car;

import com.example.commonlib.car.LocationDTO;

public final class LocationMapper {

    private LocationMapper() {
    }

    public static LocationDTO toDTO(Location location) {
        return new LocationDTO(location.getId(), location.getName());
    }
}
