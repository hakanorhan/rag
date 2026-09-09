package com.example.carservice.car;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

class FreeTextCarSearchCriteriaTest {

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
    void shouldAcceptCriteriaWithoutPeriod() {
        assertThat(validator.validate(criteria(null, null))).isEmpty();
    }

    @Test
    void shouldAcceptCompleteValidPeriod() {
        assertThat(validator.validate(criteria(PICKUP_AT, RETURN_AT))).isEmpty();
    }

    @Test
    void shouldRejectPickupWithoutReturn() {
        assertThat(validator.validate(criteria(PICKUP_AT, null))).isNotEmpty();
    }

    @Test
    void shouldRejectReturnWithoutPickup() {
        assertThat(validator.validate(criteria(null, RETURN_AT))).isNotEmpty();
    }

    @Test
    void shouldRejectInvalidPeriod() {
        assertThat(validator.validate(criteria(RETURN_AT, PICKUP_AT))).isNotEmpty();
    }

    private FreeTextCarSearchCriteria criteria(Instant pickupAt, Instant returnAt) {
        return new FreeTextCarSearchCriteria("VW", null, null, null, pickupAt, returnAt);
    }
}
