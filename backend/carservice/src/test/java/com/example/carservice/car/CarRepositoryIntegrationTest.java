package com.example.carservice.car;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.transaction.annotation.Transactional;

import com.example.carservice.TestcontainersConfiguration;
import com.example.carservice.reservation.MileagePackageRepository;
import com.example.carservice.reservation.Reservation;
import com.example.carservice.reservation.ReservationRepository;

@SpringBootTest
@Import(TestcontainersConfiguration.class)
@Transactional
class CarRepositoryIntegrationTest {

    private static final Instant PICKUP_AT = Instant.parse("2040-09-10T10:00:00Z");
    private static final Instant RETURN_AT = Instant.parse("2040-09-12T10:00:00Z");

    @Autowired
    CarRepository carRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ReservationRepository reservationRepository;

    @Autowired
    MileagePackageRepository mileagePackageRepository;

    private Car car;
    private User user;

    @BeforeEach
    void setUp() {
        car = carRepository.findAllBy().stream()
                .filter(candidate -> candidate.getCarCategory().equals("Premium Cabrio"))
                .findFirst()
                .orElseThrow();
        user = userRepository.save(user());
    }

    @ParameterizedTest
    @EnumSource(value = ReservationStatus.class, names = {"RESERVED", "ACTIVE"})
    void shouldExcludeCarWithBlockingOverlappingReservation(ReservationStatus status) {
        saveReservation(PICKUP_AT.minusSeconds(3600), RETURN_AT.minusSeconds(3600), status);

        assertThat(search(PICKUP_AT, RETURN_AT)).extracting(Car::getId).doesNotContain(car.getId());
    }

    @ParameterizedTest
    @EnumSource(value = ReservationStatus.class, names = {"CANCELLED", "COMPLETED"})
    void shouldKeepCarAvailableForClosedOverlappingReservation(ReservationStatus status) {
        saveReservation(PICKUP_AT.minusSeconds(3600), RETURN_AT.minusSeconds(3600), status);

        assertThat(search(PICKUP_AT, RETURN_AT)).extracting(Car::getId).contains(car.getId());
    }

    @Test
    void shouldAllowAdjacentNonOverlappingPeriod() {
        saveReservation(PICKUP_AT.minusSeconds(86400), PICKUP_AT, ReservationStatus.RESERVED);

        assertThat(search(PICKUP_AT, RETURN_AT)).extracting(Car::getId).contains(car.getId());
    }

    private java.util.List<Car> search(Instant pickupAt, Instant returnAt) {
        return carRepository.search(null, null, null, true, pickupAt, returnAt);
    }

    private void saveReservation(Instant pickupAt, Instant returnAt, ReservationStatus status) {
        var mileagePackage = mileagePackageRepository.findById(1L).orElseThrow();
        var reservation = new Reservation();
        reservation.setUser(user);
        reservation.setCar(car);
        reservation.setPickupLocation(car.getLocation());
        reservation.setReturnLocation(car.getLocation());
        reservation.setPickupAt(pickupAt);
        reservation.setReturnAt(returnAt);
        reservation.setStatus(status);
        reservation.setDailyRate(car.getCarType().getDailyRate());
        reservation.setTotalPrice(new BigDecimal("149.90"));
        reservation.setMileagePackage(mileagePackage);
        reservation.setIncludedKmPerDay(mileagePackage.getIncludedKmPerDay());
        reservation.setMileagePricePerDay(mileagePackage.getPricePerDay());
        reservationRepository.saveAndFlush(reservation);
    }

    private User user() {
        String id = UUID.randomUUID().toString();
        var createdUser = new User();
        createdUser.setKeycloakId(id);
        createdUser.setFirstName("Car");
        createdUser.setLastName("RepositoryTest");
        createdUser.setEmail(id + "@example.com");
        createdUser.setDriverLicenseNumber(id);
        return createdUser;
    }
}
