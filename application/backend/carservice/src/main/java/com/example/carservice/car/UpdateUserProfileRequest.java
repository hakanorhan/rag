package com.example.carservice.car;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateUserProfileRequest(
        @NotBlank
        @Size(max = 100)
        String driverLicenseNumber
) {
}
