package com.example.carservice.reservation;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import com.example.carservice.car.ReservationStatus;
import com.example.carservice.shared.CarDTO;
import com.example.carservice.shared.LocationDTO;

public record ReservationDTO(
        Long reservationId,
        CarDTO car,
        LocationDTO pickupLocation,
        LocationDTO returnLocation,
        Instant pickupAt,
        Instant returnAt,
        ReservationStatus status,
        BigDecimal dailyRate,
        BigDecimal totalPrice,
        long rentalDays,
        Long mileagePackageId,
        Integer includedKmPerDay,
        BigDecimal mileagePricePerDay,
        List<SelectedExtra> extras,
        String searchQuery
) {
    public record SelectedExtra(Long id, String name, String description, BigDecimal pricePerDay) {}
}
