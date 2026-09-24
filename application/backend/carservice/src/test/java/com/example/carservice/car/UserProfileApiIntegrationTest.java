package com.example.carservice.car;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import com.example.carservice.TestcontainersConfiguration;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestcontainersConfiguration.class)
class UserProfileApiIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    UserRepository userRepository;

    private final Set<String> createdKeycloakIds = new HashSet<>();

    @AfterEach
    void removeCreatedUsers() {
        createdKeycloakIds.stream()
                .map(keycloakId -> userRepository.findByKeycloakId(keycloakId))
                .flatMap(users -> users.stream())
                .forEach(userRepository::delete);
    }

    @Test
    void shouldCreateUserWithKeycloakIdAndDriverLicenseNumber() throws Exception {
        String keycloakId = uniqueValue();
        String email = keycloakId + "@example.com";
        String driverLicenseNumber = "LICENSE-" + uniqueValue();
        createdKeycloakIds.add(keycloakId);

        saveProfile(keycloakId, email, driverLicenseNumber)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.driverLicenseNumber").value(driverLicenseNumber));

        User savedUser = userRepository.findByKeycloakId(keycloakId).orElseThrow();
        assertThat(savedUser.getEmail()).isEqualTo(email);
        assertThat(savedUser.getDriverLicenseNumber()).isEqualTo(driverLicenseNumber);
    }

    @Test
    void shouldRejectSameDriverLicenseNumberForTwoUsers() throws Exception {
        String firstKeycloakId = uniqueValue();
        String secondKeycloakId = uniqueValue();
        String driverLicenseNumber = "LICENSE-" + uniqueValue();
        createdKeycloakIds.add(firstKeycloakId);
        createdKeycloakIds.add(secondKeycloakId);

        saveProfile(firstKeycloakId, firstKeycloakId + "@example.com", driverLicenseNumber)
                .andExpect(status().isOk());

        saveProfile(secondKeycloakId, secondKeycloakId + "@example.com", driverLicenseNumber)
                .andExpect(status().isConflict());

        assertThat(userRepository.findByKeycloakId(firstKeycloakId))
                .get()
                .extracting(user -> user.getDriverLicenseNumber())
                .isEqualTo(driverLicenseNumber);
        assertThat(userRepository.findByKeycloakId(secondKeycloakId)).isEmpty();
    }

    private org.springframework.test.web.servlet.ResultActions saveProfile(
            String keycloakId,
            String email,
            String driverLicenseNumber
    ) throws Exception {
        return mockMvc.perform(put("/users/me")
                .with(jwt().jwt(token -> token
                        .subject(keycloakId)
                        .claim("email", email)))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"driverLicenseNumber":"%s"}
                        """.formatted(driverLicenseNumber)));
    }

    private String uniqueValue() {
        return UUID.randomUUID().toString();
    }
}
