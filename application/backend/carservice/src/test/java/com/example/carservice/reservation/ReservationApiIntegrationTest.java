package com.example.carservice.reservation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;
import java.util.UUID;

import com.example.carservice.TestcontainersConfiguration;
import com.example.carservice.car.CarRepository;
import com.example.carservice.user.User;
import com.example.carservice.user.UserRepository;
import com.example.commonlib.car.CarStatus;

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
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestcontainersConfiguration.class)
@Transactional
class ReservationApiIntegrationTest {

    private static final SimpleGrantedAuthority USER_ROLE = new SimpleGrantedAuthority("ROLE_USER");

    @Autowired
    MockMvc mockMvc;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ReservationRepository reservationRepository;

    @Autowired
    CarRepository carRepository;

    private User owner;
    private User stranger;

    @BeforeEach
    void createUsers() {
        owner = userRepository.save(user("Owner"));
        stranger = userRepository.save(user("Stranger"));
    }

    @Test
    void shouldHideReservationFromAnotherDatabaseUser() throws Exception {
        long reservationId = reserveFor(owner.getKeycloakId());

        mockMvc.perform(get("/reservation/{id}", reservationId).with(userJwt(stranger.getKeycloakId())))
                .andExpect(status().isNotFound());

        mockMvc.perform(get("/reservation/{id}", reservationId).with(userJwt(owner.getKeycloakId())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reservationId").value(reservationId));
    }

    @Test
    void shouldRejectOptionChangesFromAnotherDatabaseUser() throws Exception {
        long reservationId = reserveFor(owner.getKeycloakId());

        updateOptions(reservationId, stranger.getKeycloakId(), "{\"mileagePackageId\":2,\"extraIds\":[1]}")
                .andExpect(status().isNotFound());

        mockMvc.perform(get("/reservation/{id}", reservationId).with(userJwt(owner.getKeycloakId())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.mileagePackageId").value(1))
                .andExpect(jsonPath("$.extras.length()").value(0))
                .andExpect(jsonPath("$.totalPrice").value(149.90));
    }

    @Test
    void shouldNotPersistPartialStateForInvalidOptions() throws Exception {
        long reservationId = reserveFor(owner.getKeycloakId());

        updateOptions(reservationId, owner.getKeycloakId(), "{\"mileagePackageId\":2,\"extraIds\":[1,9999]}")
                .andExpect(status().isBadRequest());

        Reservation reservation = reservationRepository.findById(reservationId).orElseThrow();
        assertThat(reservation.getMileagePackage().getId()).isEqualTo(1L);
        assertThat(reservation.getIncludedKmPerDay()).isEqualTo(100);
        assertThat(reservation.getMileagePricePerDay()).isEqualByComparingTo("0.00");
        assertThat(reservation.getExtras()).isEmpty();
        assertThat(reservation.getTotalPrice()).isEqualByComparingTo("149.90");
    }

    @Test
    void shouldRejectJwtSubjectWithoutLinkedDatabaseUser() throws Exception {
        mockMvc.perform(post("/reservation")
                        .with(userJwt("not-linked-to-a-database-user"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(reservationRequest()))
                .andExpect(status().isUnprocessableContent());
    }

    @Test
    void shouldReuseReservationForSameIdempotencyKey() throws Exception {
        var request = post("/reservation")
                .with(userJwt(owner.getKeycloakId()))
                .header("Idempotency-Key", UUID.randomUUID().toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content(reservationRequest());

        long reservationId = Long.parseLong(mockMvc.perform(request)
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString());

        mockMvc.perform(request)
                .andExpect(status().isOk())
                .andExpect(result -> assertThat(result.getResponse().getContentAsString())
                        .isEqualTo(Long.toString(reservationId)));

        reservationRepository.flush();
        assertThat(reservationRepository.findAllByUserKeycloakIdOrderByPickupAtDesc(owner.getKeycloakId()))
                .extracting(candidate -> candidate.getId())
                .containsExactly(reservationId);
    }

    @Test
    void shouldCreateReservedReservationAndBlockCarForBookedPeriod() throws Exception {
        Instant pickupAt = Instant.parse("2035-09-10T10:00:00Z");
        Instant returnAt = Instant.parse("2035-09-11T10:00:00Z");
        assertThat(carRepository.search(null, null, null, true, pickupAt, returnAt))
                .extracting(candidate -> candidate.getId()).contains(1L);
        long reservationId = reserveFor(owner.getKeycloakId());
        reservationRepository.flush();

        Reservation reservation = reservationRepository.findById(reservationId).orElseThrow();
        assertThat(reservation.getStatus()).isEqualTo(ReservationStatus.RESERVED);
        assertThat(reservation.getCar().getStatus()).isEqualTo(CarStatus.AVAILABLE);
        assertThat(carRepository.search(null, null, null, true, pickupAt, returnAt))
                .extracting(candidate -> candidate.getId()).doesNotContain(1L);
    }

    private long reserveFor(String subject) throws Exception {
        MvcResult result = mockMvc.perform(post("/reservation")
                        .with(userJwt(subject))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(reservationRequest()))
                .andExpect(status().isOk())
                .andReturn();
        return Long.parseLong(result.getResponse().getContentAsString());
    }

    private org.springframework.test.web.servlet.ResultActions updateOptions(
            long reservationId,
            String subject,
            String body
    ) throws Exception {
        return mockMvc.perform(put("/reservation/{id}/options", reservationId)
                .with(userJwt(subject))
                .contentType(MediaType.APPLICATION_JSON)
                .content(body));
    }

    private org.springframework.test.web.servlet.request.RequestPostProcessor userJwt(String subject) {
        return jwt().jwt(token -> token.subject(subject)).authorities(USER_ROLE);
    }

    private String reservationRequest() {
        return """
                {
                  "carId": 1,
                  "pickUpLocationId": 1,
                  "returnLocationId": 2,
                  "pickupAt": "2035-09-10T10:00:00Z",
                  "returnAt": "2035-09-11T10:00:00Z",
                  "mileagePackageId": 1,
                  "extraIds": []
                }
                """;
    }

    private User user(String label) {
        String uniqueId = UUID.randomUUID().toString();
        User user = new User();
        user.setKeycloakId(uniqueId);
        user.setEmail(uniqueId + "@example.com");
        user.setDriverLicenseNumber(uniqueId);
        return user;
    }
}
