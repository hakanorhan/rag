package com.example.carservice.car;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.carservice.config.SecurityConfig;

/**
 * Tests the validation behavior of the car search endpoint.
 * Ensures that invalid or missing request parameters result in HTTP 400 Bad Request and that
 * CarService is not invoked.
 */
@WebMvcTest(CarSearchController.class)
@Import(SecurityConfig.class)
class CarSearchControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    CarService carService;

    @MockitoBean
    JwtDecoder jwtDecoder;

    @Test
    void shouldBindStructuredSearchCriteria() throws Exception {
        when(carService.search(org.mockito.ArgumentMatchers.any(CarSearchCriteria.class)))
                .thenReturn(List.of());

        mockMvc.perform(get("/cars/search")
                        .param("brand", "Audi")
                        .param("model", "A5")
                        .param("carType", "Sports Car")
                        .param("location", "Düsseldorf")
                        .param("pickupAt", "2030-09-10T10:00:00Z")
                        .param("returnAt", "2030-09-11T10:00:00Z"))
                .andExpect(status().isOk());

        var criteria = org.mockito.ArgumentCaptor.forClass(CarSearchCriteria.class);
        verify(carService).search(criteria.capture());
        assertThat(criteria.getValue())
                .isEqualTo(new CarSearchCriteria(
                        "Audi",
                        "A5",
                        "Sports Car",
                        "Düsseldorf",
                        java.time.Instant.parse("2030-09-10T10:00:00Z"),
                        java.time.Instant.parse("2030-09-11T10:00:00Z")
                ));
    }

    @Test
    void shouldBindFreeTextSearchCriteria() throws Exception {
        when(carService.searchFreeText(org.mockito.ArgumentMatchers.any(FreeTextCarSearchCriteria.class)))
                .thenReturn(List.of());

        mockMvc.perform(get("/cars/search/free-text")
                        .param("brand", "VW")
                        .param("location", "Essen"))
                .andExpect(status().isOk());

        var criteria = org.mockito.ArgumentCaptor.forClass(FreeTextCarSearchCriteria.class);
        verify(carService).searchFreeText(criteria.capture());
        assertThat(criteria.getValue())
                .isEqualTo(new FreeTextCarSearchCriteria("VW", null, null, "Essen", null, null));
    }

    @Test
    void shouldReturn400NoPickUpAt() throws Exception {
        mockMvc.perform(get("/cars/search")
                        .param("location", "Berlin")
                        .param("returnAt", "2026-09-10T15:00:00Z"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.errors").isArray());

        verifyNoInteractions(carService);
    }

}
