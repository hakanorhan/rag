package com.example.carservice.reservation;

import static org.hamcrest.Matchers.startsWith;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.Map;

import com.example.carservice.config.SecurityConfig;

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

@WebMvcTest(ReservationController.class)
@Import(SecurityConfig.class)
class ReservationControllerSecurityTest {

    private static final String RESERVATION_REQUEST = """
            {
              "carId": 1,
              "pickUpLocationId": 1,
              "returnLocationId": 2,
              "pickupAt": "2035-09-10T10:00:00Z",
              "returnAt": "2035-09-15T10:00:00Z"
            }
            """;

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    ReservationService reservationService;

    @MockitoBean
    JwtDecoder jwtDecoder;

    @Test
    void shouldReturnUnauthorizedWithoutAccessToken() throws Exception {
        mockMvc.perform(reservationRequest())
                .andExpect(status().isUnauthorized())
                .andExpect(header().string(HttpHeaders.WWW_AUTHENTICATE, startsWith("Bearer")))
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.title").value("Nicht authentifiziert"))
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    void shouldReturnUnauthorizedForInvalidAccessToken() throws Exception {
        when(jwtDecoder.decode("invalid-token")).thenThrow(new BadJwtException("Invalid token"));

        mockMvc.perform(reservationRequest().header(HttpHeaders.AUTHORIZATION, "Bearer invalid-token"))
                .andExpect(status().isUnauthorized())
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    void shouldReturnForbiddenWithoutUserRole() throws Exception {
        arrangeToken("no-role-token");

        mockMvc.perform(reservationRequest().header(HttpHeaders.AUTHORIZATION, "Bearer no-role-token"))
                .andExpect(status().isForbidden())
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.status").value(403));
    }

    @Test
    void shouldReturnForbiddenWithWrongRole() throws Exception {
        arrangeToken("admin-token", "admin");

        mockMvc.perform(reservationRequest().header(HttpHeaders.AUTHORIZATION, "Bearer admin-token"))
                .andExpect(status().isForbidden())
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.title").value("Zugriff verweigert"))
                .andExpect(jsonPath("$.status").value(403));
    }

    @Test
    void shouldAllowUserRole() throws Exception {
        arrangeToken("user-token", "user");

        mockMvc.perform(reservationRequest().header(HttpHeaders.AUTHORIZATION, "Bearer user-token"))
                .andExpect(status().isOk());
    }

    private org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder reservationRequest() {
        return post("/reservation")
                .contentType(MediaType.APPLICATION_JSON)
                .content(RESERVATION_REQUEST);
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
