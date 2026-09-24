package com.example.carservice.car;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CarServiceTest {

    private static final Instant PICKUP_AT = Instant.parse("2030-09-10T10:00:00Z");
    private static final Instant RETURN_AT = Instant.parse("2030-09-11T10:00:00Z");

    @Mock
    CarRepository carRepository;

    private CarService carService;

    @BeforeEach
    void setUp() {
        carService = new CarService(carRepository);
    }

    @Test
    void shouldForwardStructuredSearchCriteria() {
        CarSearchCriteria criteria = new CarSearchCriteria(
                "Premium Cabrio", "Sports Car", "Düsseldorf", PICKUP_AT, RETURN_AT);
        when(carRepository.search(
                "Premium Cabrio", "Sports Car", "Düsseldorf", true, PICKUP_AT, RETURN_AT
        )).thenReturn(List.of());

        assertThat(carService.search(criteria)).isEmpty();

        verify(carRepository).search(
                "Premium Cabrio", "Sports Car", "Düsseldorf", true, PICKUP_AT, RETURN_AT);
    }

    @Test
    void shouldTrimCarCategory() {
        FreeTextCarSearchCriteria criteria = new FreeTextCarSearchCriteria(" Premium Cabrio ", null, null, null, null);
        when(carRepository.search("Premium Cabrio", null, null, false, null, null)).thenReturn(List.of());

        carService.searchFreeText(criteria);

        verify(carRepository).search("Premium Cabrio", null, null, false, null, null);
    }

    @Test
    void shouldConvertBlankFreeTextFiltersToNull() {
        FreeTextCarSearchCriteria criteria = new FreeTextCarSearchCriteria(" ", "", "   ", null, null);
        when(carRepository.search(null, null, null, false, null, null)).thenReturn(List.of());

        carService.searchFreeText(criteria);

        verify(carRepository).search(null, null, null, false, null, null);
    }

    @Test
    void shouldTrimFreeTextFiltersAndForwardPeriod() {
        FreeTextCarSearchCriteria criteria = new FreeTextCarSearchCriteria(
                " Premium Cabrio ", " Sports Car ", " Düsseldorf ", PICKUP_AT, RETURN_AT);
        when(carRepository.search(
                "Premium Cabrio", "Sports Car", "Düsseldorf", true, PICKUP_AT, RETURN_AT
        )).thenReturn(List.of());

        carService.searchFreeText(criteria);

        verify(carRepository).search(
                "Premium Cabrio", "Sports Car", "Düsseldorf", true, PICKUP_AT, RETURN_AT);
    }

    @Test
    void shouldForwardReturnOnlyWithoutApplyingPeriodFilter() {
        FreeTextCarSearchCriteria criteria = new FreeTextCarSearchCriteria(
                "Premium Cabrio", null, null, null, RETURN_AT);
        when(carRepository.search(
                "Premium Cabrio", null, null, false, null, RETURN_AT
        )).thenReturn(List.of());

        carService.searchFreeText(criteria);

        verify(carRepository).search(
                "Premium Cabrio", null, null, false, null, RETURN_AT);
    }
}
