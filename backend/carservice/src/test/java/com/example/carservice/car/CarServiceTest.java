package com.example.carservice.car;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
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
        var criteria = new CarSearchCriteria(
                "Audi", "A5", "Sports Car", "Düsseldorf", PICKUP_AT, RETURN_AT);
        when(carRepository.search(
                "Audi", "A5", "Sports Car", "Düsseldorf", true, PICKUP_AT, RETURN_AT
        )).thenReturn(List.of());

        assertThat(carService.search(criteria)).isEmpty();

        verify(carRepository).search(
                "Audi", "A5", "Sports Car", "Düsseldorf", true, PICKUP_AT, RETURN_AT);
    }

    @ParameterizedTest
    @CsvSource({
            "vw, Volkswagen",
            "Volkswagen, Volkswagen",
            "skoda, Škoda",
            "Škoda, Škoda"
    })
    void shouldNormalizeKnownBrandNames(String input, String expected) {
        var criteria = new FreeTextCarSearchCriteria(input, null, null, null, null, null);
        when(carRepository.search(expected, null, null, null, false, null, null)).thenReturn(List.of());

        carService.searchFreeText(criteria);

        verify(carRepository).search(expected, null, null, null, false, null, null);
    }

    @Test
    void shouldConvertBlankFreeTextFiltersToNull() {
        var criteria = new FreeTextCarSearchCriteria(" ", "  ", "", "   ", null, null);
        when(carRepository.search(null, null, null, null, false, null, null)).thenReturn(List.of());

        carService.searchFreeText(criteria);

        verify(carRepository).search(null, null, null, null, false, null, null);
    }

    @Test
    void shouldTrimFreeTextFiltersAndForwardPeriod() {
        var criteria = new FreeTextCarSearchCriteria(
                " Audi ", " A5 ", " Sports Car ", " Düsseldorf ", PICKUP_AT, RETURN_AT);
        when(carRepository.search(
                "Audi", "A5", "Sports Car", "Düsseldorf", true, PICKUP_AT, RETURN_AT
        )).thenReturn(List.of());

        carService.searchFreeText(criteria);

        verify(carRepository).search(
                "Audi", "A5", "Sports Car", "Düsseldorf", true, PICKUP_AT, RETURN_AT);
    }
}
