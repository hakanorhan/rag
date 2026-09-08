package com.example.carservice.reservation;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

import com.example.carservice.TestcontainersConfiguration;
import com.example.carservice.car.ReservationStatus;
import com.example.carservice.car.User;
import com.example.carservice.car.UserRepository;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestcontainersConfiguration.class)
class ReservationIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ReservationRepository reservationRepository;

    private User user;

    @BeforeEach
    void createCustomer() {
        user = new User();
        user.setKeycloakId(UUID.randomUUID().toString());
        user.setFirstName("Test");
        user.setLastName("Customer");
        user.setEmail(user.getKeycloakId() + "@example.com");
        user.setDriverLicenseNumber(user.getKeycloakId());
        user = userRepository.save(user);
    }

    @AfterEach
    void removeCustomerReservations() {
        var reservations = reservationRepository.findAll().stream()
                .filter(reservation -> reservation.getUser().getId().equals(user.getId()))
                .toList();
        reservationRepository.deleteAll(reservations);
        userRepository.delete(user);
    }

    @Test
    void shouldSaveAndReadOwnReservationWithLocationsAndPrice() throws Exception {
        var result = reserve("2030-09-10T10:00:00Z", "2030-09-11T10:00:01Z");
        assertThat(result.getResponse().getStatus()).isEqualTo(200);
        long id = Long.parseLong(result.getResponse().getContentAsString());

        mockMvc.perform(get("/reservation/{id}", id)
                        .with(jwt().jwt(token -> token.subject(user.getKeycloakId()))
                                .authorities(new SimpleGrantedAuthority("ROLE_USER"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reservationId").value(id))
                .andExpect(jsonPath("$.pickupLocation.locationId").value(1))
                .andExpect(jsonPath("$.pickupLocation.name").value("Düsseldorf"))
                .andExpect(jsonPath("$.returnLocation.locationId").value(2))
                .andExpect(jsonPath("$.car.location.locationId").value(1))
                .andExpect(jsonPath("$.car.imageUrl").value("/images/rentcars/audi-a5-cabrio.png"))
                .andExpect(jsonPath("$.status").value("RESERVED"))
                .andExpect(jsonPath("$.dailyRate").value(69.90))
                .andExpect(jsonPath("$.totalPrice").value(139.80));

        mockMvc.perform(get("/reservation/{id}", id)
                        .with(jwt().jwt(token -> token.subject("another-user"))
                                .authorities(new SimpleGrantedAuthority("ROLE_USER"))))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldRejectOverlapAndAllowAdjacentPeriod() throws Exception {
        assertThat(reserve("2030-09-10T10:00:00Z", "2030-09-11T10:00:00Z")
                .getResponse().getStatus()).isEqualTo(200);
        var overlap = reserve("2030-09-11T09:00:00Z", "2030-09-12T10:00:00Z");
        assertThat(overlap.getResponse().getStatus()).isEqualTo(409);
        assertThat(overlap.getResponse().getContentAsString()).contains("Fahrzeug nicht verfügbar");
        assertThat(reserve("2030-09-11T10:00:00Z", "2030-09-12T10:00:00Z")
                .getResponse().getStatus()).isEqualTo(200);
    }

    @Test
    void shouldRejectOverlapWithActiveReservationAndAllowCancelledReservation() throws Exception {
        var result = reserve("2030-09-10T10:00:00Z", "2030-09-11T10:00:00Z");
        var reservation = reservationRepository.findById(
                Long.parseLong(result.getResponse().getContentAsString())).orElseThrow();
        reservation.setStatus(ReservationStatus.ACTIVE);
        reservationRepository.save(reservation);
        assertThat(reserve("2030-09-10T10:00:00Z", "2030-09-11T10:00:00Z")
                .getResponse().getStatus()).isEqualTo(409);
        reservation.setStatus(ReservationStatus.CANCELLED);
        reservationRepository.save(reservation);
        assertThat(reserve("2030-09-10T10:00:00Z", "2030-09-11T10:00:00Z")
                .getResponse().getStatus()).isEqualTo(200);
    }

    @Test
    void shouldOnlySaveOneOfTwoConcurrentReservations() {
        var first = CompletableFuture.supplyAsync(this::reserveConcurrently);
        var second = CompletableFuture.supplyAsync(this::reserveConcurrently);
        assertThat(List.of(first.join(), second.join())).containsExactlyInAnyOrder(200, 409);
    }

    @Test
    void shouldRejectInvalidPeriodWithoutSaving() throws Exception {
        assertThat(reserve("2030-09-11T10:00:00Z", "2030-09-10T10:00:00Z")
                .getResponse().getStatus()).isEqualTo(400);
    }

    @Test
    void shouldRejectUnlinkedKeycloakUser() throws Exception {
        mockMvc.perform(post("/reservation")
                        .with(jwt().jwt(token -> token.subject("unlinked-user"))
                                .authorities(new SimpleGrantedAuthority("ROLE_USER")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request("2030-09-10T10:00:00Z", "2030-09-11T10:00:00Z")))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldExposeLocationsWithoutAuthentication() throws Exception {
        mockMvc.perform(get("/locations"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].locationId").value(1))
                .andExpect(jsonPath("$[0].name").value("Düsseldorf"));
    }

    private int reserveConcurrently() {
        try {
            return reserve("2030-09-10T10:00:00Z", "2030-09-11T10:00:00Z")
                    .getResponse().getStatus();
        } catch (Exception ex) {
            throw new IllegalStateException(ex);
        }
    }

    @Test
    void shouldSaveOptionsAndCalculatePriceForStartedRentalDays() throws Exception {
        long id = Long.parseLong(reserve("2030-09-10T10:00:00Z", "2030-09-11T10:00:01Z")
                .getResponse().getContentAsString());
        // Two started days: (69.90 vehicle + 12 mileage + 8 child seat + 12 driver) * 2.
        for (int attempt = 0; attempt < 2; attempt++) {
            updateOptions(id, user.getKeycloakId(), "{\"mileagePackageId\":2,\"extraIds\":[1,2]}")
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.rentalDays").value(2))
                    .andExpect(jsonPath("$.includedKmPerDay").value(300))
                    .andExpect(jsonPath("$.extras.length()").value(2))
                    .andExpect(jsonPath("$.totalPrice").value(203.80));
        }
        mockMvc.perform(get("/reservation/{id}", id)
                        .with(jwt().jwt(token -> token.subject(user.getKeycloakId()))
                                .authorities(new SimpleGrantedAuthority("ROLE_USER"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.mileagePackageId").value(2))
                .andExpect(jsonPath("$.totalPrice").value(203.80))
                .andExpect(jsonPath("$.extras.length()").value(2));

        updateOptions(id, user.getKeycloakId(), "{\"mileagePackageId\":3,\"extraIds\":[]}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.includedKmPerDay").doesNotExist())
                .andExpect(jsonPath("$.extras.length()").value(0))
                .andExpect(jsonPath("$.totalPrice").value(189.80));
        updateOptions(id, user.getKeycloakId(), "{\"mileagePackageId\":1,\"extraIds\":[]}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalPrice").value(139.80));
    }

    @Test
    void shouldRejectInvalidOptionsAndForeignOrClosedReservations() throws Exception {
        long id = Long.parseLong(reserve("2030-09-10T10:00:00Z", "2030-09-11T10:00:00Z")
                .getResponse().getContentAsString());
        String valid = "{\"mileagePackageId\":2,\"extraIds\":[1]}";
        mockMvc.perform(put("/reservation/{id}/options", id)
                        .contentType(MediaType.APPLICATION_JSON).content(valid))
                .andExpect(status().isUnauthorized());
        updateOptions(id, "another-user", valid).andExpect(status().isNotFound());
        updateOptions(id, user.getKeycloakId(), "{\"mileagePackageId\":9999,\"extraIds\":[]}")
                .andExpect(status().isBadRequest());
        updateOptions(id, user.getKeycloakId(), "{\"mileagePackageId\":2,\"extraIds\":[9999]}")
                .andExpect(status().isBadRequest());
        updateOptions(id, user.getKeycloakId(), "{\"mileagePackageId\":2,\"extraIds\":null}")
                .andExpect(status().isBadRequest());
        var reservation = reservationRepository.findById(id).orElseThrow();
        assertThat(reservation.getTotalPrice()).isEqualByComparingTo("69.90");
        reservation.setStatus(ReservationStatus.COMPLETED);
        reservationRepository.save(reservation);
        updateOptions(id, user.getKeycloakId(), valid).andExpect(status().isConflict());
    }

    @Test
    void shouldExposeDatabaseCatalogueAndPreserveSearchQuery() throws Exception {
        mockMvc.perform(get("/reservation/options")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_USER"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.mileagePackages.length()").value(3))
                .andExpect(jsonPath("$.extras.length()").value(3));
        var result = mockMvc.perform(post("/reservation")
                        .with(jwt().jwt(token -> token.subject(user.getKeycloakId()))
                                .authorities(new SimpleGrantedAuthority("ROLE_USER")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request("2030-09-10T10:00:00Z", "2030-09-11T10:00:00Z")
                                .replace("\"carId\": 1,", "\"carId\": 1, \"searchQuery\": \"Cabrio in Düsseldorf\",")))
                .andExpect(status().isOk()).andReturn();
        var reservation = reservationRepository.findById(Long.parseLong(result.getResponse().getContentAsString())).orElseThrow();
        assertThat(reservation.getSearchQuery()).isEqualTo("Cabrio in Düsseldorf");
    }

    private org.springframework.test.web.servlet.ResultActions updateOptions(long id, String subject, String body) throws Exception {
        return mockMvc.perform(put("/reservation/{id}/options", id)
                .with(jwt().jwt(token -> token.subject(subject)).authorities(new SimpleGrantedAuthority("ROLE_USER")))
                .contentType(MediaType.APPLICATION_JSON).content(body));
    }

    private MvcResult reserve(String pickupAt, String returnAt) throws Exception {
        return mockMvc.perform(post("/reservation")
                        .with(jwt().jwt(token -> token.subject(user.getKeycloakId()))
                                .authorities(new SimpleGrantedAuthority("ROLE_USER")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request(pickupAt, returnAt)))
                .andReturn();
    }

    private String request(String pickupAt, String returnAt) {
        return """
                {
                  "carId": 1,
                  "pickUpLocationId": 1,
                  "returnLocationId": 2,
                  "pickupAt": "%s",
                  "returnAt": "%s"
                }
                """.formatted(pickupAt, returnAt);
    }
}
