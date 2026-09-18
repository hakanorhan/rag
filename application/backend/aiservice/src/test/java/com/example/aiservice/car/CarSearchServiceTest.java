package com.example.aiservice.car;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;

import org.junit.jupiter.api.Test;

class CarSearchServiceTest {

    @Test
    void shouldAddOneCalendarWeekWhenOnlyPickupIsGiven() {
        Instant pickupAt = Instant.parse("2026-10-24T08:00:00Z");

        var period = CarSearchService.completeRentalPeriod(pickupAt, null);

        assertThat(period.pickupAt()).isEqualTo(pickupAt);
        assertThat(period.returnAt()).isEqualTo(Instant.parse("2026-10-31T09:00:00Z"));
    }

    @Test
    void shouldKeepReturnWhenOnlyReturnIsGiven() {
        Instant returnAt = Instant.parse("2026-10-31T09:00:00Z");

        var period = CarSearchService.completeRentalPeriod(null, returnAt);

        assertThat(period.pickupAt()).isNull();
        assertThat(period.returnAt()).isEqualTo(returnAt);
    }

    @Test
    void shouldKeepCompletePeriodUnchanged() {
        Instant pickupAt = Instant.parse("2026-09-20T08:00:00Z");
        Instant returnAt = Instant.parse("2026-09-27T08:00:00Z");

        var period = CarSearchService.completeRentalPeriod(pickupAt, returnAt);

        assertThat(period.pickupAt()).isEqualTo(pickupAt);
        assertThat(period.returnAt()).isEqualTo(returnAt);
    }
}
