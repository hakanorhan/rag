package com.example.carservice.shared;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CarSearchCriteriaTest {

    @Test
    void shouldReturnFalseWhenReturnAtIsBeforePickupAt() {
        CarSearchCriteria criteria = new CarSearchCriteria(
                "BMW",
                "M3",
                "SPORT",
                "Berlin",
                Instant.parse("2026-09-10T15:00:00Z"),
                Instant.parse("2026-09-10T10:00:00Z")
        );

        assertFalse(criteria.isPeriodValid());
    }

    @Test
    void shouldReturnTrueWhenReturnAtIsAfterPickupAt() {
        CarSearchCriteria criteria = new CarSearchCriteria(
                "BMW",
                "M3",
                "SPORT",
                "Berlin",
                Instant.parse("2026-09-10T10:00:00Z"),
                Instant.parse("2026-09-10T15:00:00Z")
        );

        assertTrue(criteria.isPeriodValid());
    }
}