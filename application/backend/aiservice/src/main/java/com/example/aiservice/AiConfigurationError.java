package com.example.aiservice;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum AiConfigurationError {
    PROVIDER_NOT_CONFIGURED(HttpStatus.SERVICE_UNAVAILABLE),
    INVALID_CONFIGURATION(HttpStatus.BAD_REQUEST);

    private final HttpStatus status;
}
