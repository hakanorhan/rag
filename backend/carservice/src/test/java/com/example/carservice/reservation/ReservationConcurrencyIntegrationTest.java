package com.example.carservice.reservation;

import static java.util.concurrent.TimeUnit.SECONDS;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executors;

import com.example.carservice.TestcontainersConfiguration;
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

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestcontainersConfiguration.class)
class ReservationConcurrencyIntegrationTest {

    private static final Instant PICKUP_AT = Instant.parse("2036-09-10T10:00:00Z");
    private static final Instant RETURN_AT = Instant.parse("2036-09-11T10:00:00Z");

    @Autowired
    MockMvc mockMvc;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ReservationRepository reservationRepository;

    private User firstUser;
    private User secondUser;

    @BeforeEach
    void createUsers() {
        firstUser = userRepository.save(user("First"));
        secondUser = userRepository.save(user("Second"));
    }

    @AfterEach
    void removeTestData() {
        Set<Long> userIds = Set.of(firstUser.getId(), secondUser.getId());
        var reservations = reservationRepository.findAll().stream()
                .filter(reservation -> userIds.contains(reservation.getUser().getId()))
                .toList();
        reservationRepository.deleteAll(reservations);
        userRepository.deleteAll(List.of(firstUser, secondUser));
    }

    @Test
    void shouldRejectOneOfTwoConcurrentReservationRequests() throws Exception {
        var result = executeConcurrentReservations();

        assertThat(result.statusCodes()).containsExactlyInAnyOrder(200, 409);
    }

    @Test
    void shouldPersistExactlyOneReservationAfterConcurrentRequests() throws Exception {
        executeConcurrentReservations();

        Set<Long> userIds = Set.of(firstUser.getId(), secondUser.getId());
        var matchingReservations = reservationRepository.findAll().stream()
                .filter(reservation -> userIds.contains(reservation.getUser().getId()))
                .filter(reservation -> reservation.getCar().getId().equals(1L))
                .filter(reservation -> reservation.getPickupAt().equals(PICKUP_AT))
                .filter(reservation -> reservation.getReturnAt().equals(RETURN_AT))
                .toList();

        assertThat(matchingReservations).hasSize(1);
    }

    private RaceResult executeConcurrentReservations() throws Exception {
        var ready = new CountDownLatch(2);
        var start = new CountDownLatch(1);

        try (var executor = Executors.newFixedThreadPool(2)) {
            var first = executor.submit(() -> reserve(firstUser.getKeycloakId(), ready, start));
            var second = executor.submit(() -> reserve(secondUser.getKeycloakId(), ready, start));

            assertThat(ready.await(5, SECONDS)).isTrue();
            start.countDown();

            return new RaceResult(List.of(first.get(30, SECONDS), second.get(30, SECONDS)));
        }
    }

    private int reserve(String subject, CountDownLatch ready, CountDownLatch start) throws Exception {
        ready.countDown();
        if (!start.await(5, SECONDS)) {
            throw new IllegalStateException("Concurrent reservation start timed out");
        }

        return mockMvc.perform(post("/reservation")
                        .with(jwt().jwt(token -> token.subject(subject))
                                .authorities(new SimpleGrantedAuthority("ROLE_USER")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(reservationRequest()))
                .andReturn()
                .getResponse()
                .getStatus();
    }

    private String reservationRequest() {
        return """
                {
                  "carId": 1,
                  "pickUpLocationId": 1,
                  "returnLocationId": 2,
                  "pickupAt": "%s",
                  "returnAt": "%s"
                }
                """.formatted(PICKUP_AT, RETURN_AT);
    }

    private User user(String label) {
        String uniqueId = UUID.randomUUID().toString();
        var user = new User();
        user.setKeycloakId(uniqueId);
        user.setFirstName(label);
        user.setLastName("Concurrency");
        user.setEmail(uniqueId + "@example.com");
        user.setDriverLicenseNumber(uniqueId);
        return user;
    }

    private record RaceResult(List<Integer> statusCodes) {
    }
}
