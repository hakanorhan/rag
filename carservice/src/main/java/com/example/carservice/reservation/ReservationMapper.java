package com.example.carservice.reservation;

import com.example.carservice.car.CarMapper;
import com.example.carservice.car.LocationMapper;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class ReservationMapper {

    public static ReservationDTO toDTO(Reservation reservation) {
        return new ReservationDTO(
                reservation.getId(),
                CarMapper.toDTO(reservation.getCar()),
                LocationMapper.toDTO(reservation.getPickupLocation()),
                LocationMapper.toDTO(reservation.getReturnLocation()),
                reservation.getPickupAt(),
                reservation.getReturnAt(),
                reservation.getStatus(),
                reservation.getDailyRate(),
                reservation.getTotalPrice(),
                reservation.getRentalDays(),
                reservation.getMileagePackage().getId(),
                reservation.getIncludedKmPerDay(),
                reservation.getMileagePricePerDay(),
                reservation.getExtras().stream().map(selected -> new ReservationDTO.SelectedExtra(
                        selected.getExtra().getId(), selected.getExtra().getName(),
                        selected.getExtra().getDescription(), selected.getUnitPrice()
                )).toList(),
                reservation.getSearchQuery()
        );
    }
}
