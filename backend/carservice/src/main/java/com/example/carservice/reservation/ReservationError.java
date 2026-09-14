package com.example.carservice.reservation;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ReservationError {
    DRIVER_LICENSE_REQUIRED(HttpStatus.UNPROCESSABLE_CONTENT),
    CAR_NOT_FOUND(HttpStatus.NOT_FOUND),
    PICKUP_LOCATION_NOT_FOUND(HttpStatus.NOT_FOUND),
    RETURN_LOCATION_NOT_FOUND(HttpStatus.NOT_FOUND),
    CAR_UNAVAILABLE(HttpStatus.CONFLICT),
    MILEAGE_PACKAGE_NOT_FOUND(HttpStatus.BAD_REQUEST),
    EXTRA_NOT_FOUND(HttpStatus.BAD_REQUEST),
    RESERVATION_NOT_FOUND(HttpStatus.NOT_FOUND),
    RESERVATION_NOT_EDITABLE(HttpStatus.CONFLICT);

    private final HttpStatus status;
}
