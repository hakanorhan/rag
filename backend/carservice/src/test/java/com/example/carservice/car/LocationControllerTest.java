package com.example.carservice.car;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import com.example.carservice.config.SecurityConfig;
import com.example.commonlib.car.LocationDTO;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(LocationController.class)
@Import(SecurityConfig.class)
class LocationControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    LocationService locationService;

    @MockitoBean
    JwtDecoder jwtDecoder;

    @Test
    void shouldReturnLocationsWithoutAuthentication() throws Exception {
        when(locationService.allLocations()).thenReturn(List.of(new LocationDTO(1L, "Düsseldorf")));

        mockMvc.perform(get("/locations"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].locationId").value(1))
                .andExpect(jsonPath("$[0].name").value("Düsseldorf"));
    }
}
