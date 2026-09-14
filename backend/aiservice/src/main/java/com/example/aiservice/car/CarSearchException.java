package com.example.aiservice.car;

import lombok.Getter;

@Getter
public class CarSearchException extends RuntimeException {

    private final CarSearchError error;

    public CarSearchException(CarSearchError error) {
        super(error.name());
        this.error = error;
    }
}
