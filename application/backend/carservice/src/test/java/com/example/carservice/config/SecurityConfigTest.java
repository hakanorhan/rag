package com.example.carservice.config;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.carservice.car.CarSearchController;
import com.example.carservice.car.CarService;
import com.example.carservice.car.LocationController;
import com.example.carservice.car.LocationService;
import com.example.carservice.reservation.ReservationController;
import com.example.carservice.reservation.ReservationService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest({CarSearchController.class, LocationController.class, ReservationController.class})
@Import(SecurityConfig.class)
class SecurityConfigTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    CarService carService;

    @MockitoBean
    LocationService locationService;

    @MockitoBean
    ReservationService reservationService;

    @MockitoBean
    JwtDecoder jwtDecoder;

    @ParameterizedTest
    @ValueSource(strings = {
            "/cars",
            "/cars/search?location=Berlin&pickupAt=2030-09-10T10:00:00Z&returnAt=2030-09-11T10:00:00Z",
            "/cars/search/free-text",
            "/locations"
    })
    void shouldAllowConfiguredPublicGetEndpointsWithoutToken(String endpoint) throws Exception {
        mockMvc.perform(get(endpoint))
                .andExpect(status().isOk());
    }

    @Test
    void shouldRequireAuthenticationForProtectedEndpoint() throws Exception {
        mockMvc.perform(get("/reservations"))
                .andExpect(status().isUnauthorized());
    }
}
