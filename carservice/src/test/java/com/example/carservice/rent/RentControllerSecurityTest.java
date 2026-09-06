package com.example.carservice.rent;

import com.example.carservice.reservation.ReservationService;
import com.example.carservice.config.SecurityConfig;
import com.example.carservice.reservation.ReservationController;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.BadJwtException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Map;

import static org.hamcrest.Matchers.startsWith;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ReservationController.class)
@Import(SecurityConfig.class)
class RentControllerSecurityTest {

    private static final String RENT_REQUEST = """
            {
              "carId": 1,
              "pickUpLocationId": 1,
              "returnLocationId": 2,
              "pickupAt": "2026-09-10T10:00:00Z",
              "returnAt": "2026-09-15T10:00:00Z"
            }
            """;

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    ReservationService reservationService;

    @MockitoBean
    JwtDecoder jwtDecoder;

    @Test
    void shouldReturn401WithoutAccessToken() throws Exception {
        mockMvc.perform(post("/reservation")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(RENT_REQUEST))
                .andExpect(status().isUnauthorized())
                .andExpect(header().string(HttpHeaders.WWW_AUTHENTICATE, startsWith("Bearer")))
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.title").value("Nicht authentifiziert"))
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.detail").value("Ein gültiges Access Token ist erforderlich."))
                .andExpect(jsonPath("$.instance").value("/reservation"));
    }

    @Test
    void shouldReturn401WithInvalidAccessToken() throws Exception {
        when(jwtDecoder.decode("invalid-token"))
                .thenThrow(new BadJwtException("Invalid token"));

        mockMvc.perform(post("/reservation")
                        .header("Authorization", "Bearer invalid-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(RENT_REQUEST))
                .andExpect(status().isUnauthorized())
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.title").value("Nicht authentifiziert"))
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    void shouldReturn403WithAdminRoleOnly() throws Exception {
        arrangeToken("admin-token", "admin");

        mockMvc.perform(post("/reservation")
                        .header("Authorization", "Bearer admin-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(RENT_REQUEST))
                .andExpect(status().isForbidden())
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.title").value("Zugriff verweigert"))
                .andExpect(jsonPath("$.status").value(403))
                .andExpect(jsonPath("$.detail").value("Für diese Aktion fehlt die erforderliche Berechtigung."))
                .andExpect(jsonPath("$.instance").value("/reservation"));
    }

    @Test
    void shouldAllowUserRole() throws Exception {
        arrangeToken("user-token", "user");

        mockMvc.perform(post("/reservation")
                        .header("Authorization", "Bearer user-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(RENT_REQUEST))
                .andExpect(status().isOk());
    }

    @Test
    void shouldAllowUserAndAdminRoles() throws Exception {
        arrangeToken("user-admin-token", "user", "admin");

        mockMvc.perform(post("/reservation")
                        .header("Authorization", "Bearer user-admin-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(RENT_REQUEST))
                .andExpect(status().isOk());
    }

    private void arrangeToken(String tokenValue, String... roles) {
        Jwt jwt = Jwt.withTokenValue(tokenValue)
                .header("alg", "RS256")
                .subject("test-user")
                .claim("realm_access", Map.of("roles", Arrays.asList(roles)))
                .build();

        when(jwtDecoder.decode(tokenValue)).thenReturn(jwt);
    }
}
