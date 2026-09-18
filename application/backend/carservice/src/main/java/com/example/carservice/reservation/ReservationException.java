package com.example.carservice.reservation;

import lombok.Getter;

@Getter
public class ReservationException extends RuntimeException {

    private final ReservationError error;

    public ReservationException(ReservationError error) {
        super(error.name());
        this.error = error;
    }
}
