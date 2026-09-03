package com.example.carservice.ai;

import com.example.carservice.car.CarService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;

@WebMvcTest(CarSearchController.class)
/**
 * Tests the validation behavior of the car search endpoint.
 * Ensures that invalid or missing request parameters result in HTTP 400 Bad Request and that
 * CarService is not invoked.
 */
class CarSearchControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    CarService carService;

    @Test
    void shouldReturn400NoPickUpAt() throws Exception{

        mockMvc.perform(get("/cars/search").with(jwt())
                .param("location", "Berlin")
                .param("returnAt","2026-09-10T15:00:00Z"))
                .andExpect(status().isBadRequest()
        );

        // Should not process carservice
        verifyNoInteractions(carService);
    }

    @Test
    void shouldReturn400NoReturnAt() throws Exception {

        mockMvc.perform(get("/cars/search").with(jwt())
                        .param("location", "Berlin")
                        .param("pickupAt", "2026-09-10T10:00:00Z"))
                .andExpect(status().isBadRequest());

        // Should not process carService
        verifyNoInteractions(carService);
    }

    @Test
    void shouldReturn400NoLocation() throws Exception {

        mockMvc.perform(get("/cars/search").with(jwt())
                        .param("pickupAt", "2026-09-10T10:00:00Z")
                        .param("returnAt", "2026-09-10T15:00:00Z"))
                .andExpect(status().isBadRequest());

        // Should not process carService
        verifyNoInteractions(carService);
    }

    @Test
    void shouldReturn400BlankLocation() throws Exception {

        mockMvc.perform(get("/cars/search").with(jwt())
                        .param("location", "   ")
                        .param("pickupAt", "2026-09-10T10:00:00Z")
                        .param("returnAt", "2026-09-10T15:00:00Z"))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(carService);
    }
}
