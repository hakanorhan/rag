package com.example.aiservice;

import lombok.Getter;

@Getter
public class AiConfigurationException extends RuntimeException {

    private final AiConfigurationError error;

    public AiConfigurationException(AiConfigurationError error) {
        super(error.name());
        this.error = error;
    }
}
