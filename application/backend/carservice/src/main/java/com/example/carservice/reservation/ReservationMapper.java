package com.example.carservice.reservation;

import java.util.List;

import com.example.carservice.car.Car;
import com.example.carservice.car.CarMapper;
import com.example.carservice.car.Extra;
import com.example.carservice.car.Location;
import com.example.carservice.car.LocationMapper;
import com.example.carservice.car.ReservationExtra;
import com.example.carservice.car.User;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class ReservationMapper {

    public static Reservation toEntity(
            ReservationCarRequest request,
            User user,
            Car car,
            Location pickupLocation,
            Location returnLocation,
            MileagePackage mileagePackage,
            List<Extra> extras,
            String idempotencyKey
    ) {
        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setCar(car);
        reservation.setPickupLocation(pickupLocation);
        reservation.setReturnLocation(returnLocation);
        reservation.setPickupAt(request.pickupAt());
        reservation.setReturnAt(request.returnAt());
        reservation.setDailyRate(car.getCarType().getDailyRate());
        reservation.setMileagePackage(mileagePackage);
        reservation.setIncludedKmPerDay(mileagePackage.getIncludedKmPerDay());
        reservation.setMileagePricePerDay(mileagePackage.getPricePerDay());
        reservation.setSearchQuery(request.searchQuery());
        reservation.setIdempotencyKey(idempotencyKey);

        for (Extra extra : extras) {
            ReservationExtra selected = new ReservationExtra();
            selected.setReservation(reservation);
            selected.setExtra(extra);
            selected.setUnitPrice(extra.getPricePerDay());
            reservation.getExtras().add(selected);
        }

        return reservation;
    }

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
