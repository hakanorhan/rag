package com.example.carservice.config;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.carservice.car.CarSearchController;
import com.example.carservice.car.CarService;
import com.example.carservice.car.LocationController;
import com.example.carservice.car.LocationService;
import com.example.carservice.car.UserController;
import com.example.carservice.car.UserService;
import com.example.carservice.payment.paypal.PaypalConfig;
import com.example.carservice.payment.paypal.PaypalController;
import com.example.carservice.payment.service.PaymentService;
import com.example.carservice.reservation.ReservationController;
import com.example.carservice.reservation.ReservationService;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest({
        CarSearchController.class,
        LocationController.class,
        ReservationController.class,
        UserController.class,
        PaypalController.class
})
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
    UserService userService;

    @MockitoBean
    PaypalConfig paypalConfig;

    @MockitoBean
    PaymentService paymentService;

    @MockitoBean
    JwtDecoder jwtDecoder;

    @ParameterizedTest
    @ValueSource(strings = {
            "/cars",
            "/cars/search?location=Berlin&pickupAt=2030-09-10T10:00:00Z&returnAt=2030-09-11T10:00:00Z",
            "/cars/search/free-text",
            "/locations",
            "/reservation/options"
    })
    void shouldAllowConfiguredPublicGetEndpointsWithoutToken(String endpoint) throws Exception {
        mockMvc.perform(get(endpoint))
                .andExpect(status().isOk());
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "/reservations",
            "/reservation/1",
            "/reservation/1/options",
            "/reservation",
            "/users/me",
            "/paypal/config",
            "/paypal/reservations/1",
            "/paypal/orders",
            "/paypal/orders/order-1/capture"
    })
    void shouldRequireAuthenticationForEveryProtectedEndpoint(String endpoint) throws Exception {
        mockMvc.perform(get(endpoint))
                .andExpect(status().isUnauthorized());
    }
}