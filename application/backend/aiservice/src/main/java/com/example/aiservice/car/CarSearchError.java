package com.example.aiservice.car;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum CarSearchError {
    SEARCH_PARAMETERS_UNAVAILABLE(HttpStatus.BAD_REQUEST),
    INVALID_RENTAL_PERIOD(HttpStatus.BAD_REQUEST);

    private final HttpStatus status;
}
