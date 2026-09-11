package com.example.carservice.car;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

class CarSearchCriteriaTest {

    private static final Instant PICKUP_AT = Instant.parse("2030-09-10T10:00:00Z");
    private static final Instant RETURN_AT = Instant.parse("2030-09-10T15:00:00Z");

    private static ValidatorFactory validatorFactory;
    private static Validator validator;

    @BeforeAll
    static void createValidator() {
        validatorFactory = Validation.buildDefaultValidatorFactory();
        validator = validatorFactory.getValidator();
    }

    @AfterAll
    static void closeValidatorFactory() {
        validatorFactory.close();
    }
    
    @Test
    void shouldRejectBlankLocation() {
        var violations = validator.validate(criteria("   ", PICKUP_AT, RETURN_AT));

        assertThat(violations)
                .extracting(violation -> violation.getPropertyPath().toString())
                .containsExactly("location");
    }

    @Test
    void shouldRejectMissingPickupAndReturnTime() {
        var violations = validator.validate(criteria("Berlin", null, null));

        assertThat(violations)
                .extracting(violation -> violation.getPropertyPath().toString())
                .containsExactlyInAnyOrder("pickupAt", "returnAt");
    }

    @Test
    void shouldRejectReturnBeforePickup() {
        var violations = validator.validate(criteria("Berlin", RETURN_AT, PICKUP_AT));

        assertThat(violations)
                .extracting(violation -> violation.getPropertyPath().toString())
                .containsExactly("periodValid");
    }

    @Test
    void shouldRejectEqualPickupAndReturnTime() {
        assertThat(validator.validate(criteria("Berlin", PICKUP_AT, PICKUP_AT))).isNotEmpty();
    }

    private CarSearchCriteria criteria(String location, Instant pickupAt, Instant returnAt) {
        return new CarSearchCriteria("Performance Hatch", "Sports Car", location, pickupAt, returnAt);
    }
}
