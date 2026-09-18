package com.example.carservice.car;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum UserProfileError {
    KEYCLOAK_EMAIL_REQUIRED(HttpStatus.BAD_REQUEST),
    USER_PROFILE_CONFLICT(HttpStatus.CONFLICT);

    private final HttpStatus status;
}
