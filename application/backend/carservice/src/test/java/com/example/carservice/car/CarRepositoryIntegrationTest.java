package com.example.carservice.car;

import com.example.carservice.reservation.ReservationStatus;
import com.example.carservice.user.User;
import com.example.carservice.user.UserRepository;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.EnumSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.transaction.annotation.Transactional;

import com.example.carservice.TestcontainersConfiguration;
import com.example.carservice.reservation.MileagePackage;
import com.example.carservice.reservation.MileagePackageRepository;
import com.example.carservice.reservation.Reservation;
import com.example.carservice.reservation.ReservationRepository;
import com.example.commonlib.car.CarStatus;

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

        assertThat(search(PICKUP_AT, RETURN_AT)).extracting(candidate -> candidate.getId()).doesNotContain(car.getId());
    }

    @ParameterizedTest
    @CsvSource({"RESERVED, CANCELLED", "ACTIVE, COMPLETED"})
    void shouldMakeCarSearchableAfterStoredReservationIsClosed(
            ReservationStatus initialStatus, ReservationStatus finalStatus) {
        Reservation reservation = saveReservation(PICKUP_AT, RETURN_AT, initialStatus);
        assertThat(search(PICKUP_AT, RETURN_AT)).extracting(candidate -> candidate.getId()).doesNotContain(car.getId());

        reservation.setStatus(finalStatus);
        reservationRepository.saveAndFlush(reservation);

        assertThat(search(PICKUP_AT, RETURN_AT)).extracting(candidate -> candidate.getId()).contains(car.getId());
    }

    @ParameterizedTest
    @EnumSource(value = CarStatus.class, names = {"RENTED", "MAINTENANCE"})
    void shouldUpdateSearchWhenStoredCarStatusChanges(CarStatus status) {
        assertThat(search(PICKUP_AT, RETURN_AT)).extracting(candidate -> candidate.getId()).contains(car.getId());

        car.setStatus(status);
        carRepository.saveAndFlush(car);
        assertThat(search(PICKUP_AT, RETURN_AT)).extracting(candidate -> candidate.getId()).doesNotContain(car.getId());

        car.setStatus(CarStatus.AVAILABLE);
        carRepository.saveAndFlush(car);
        assertThat(search(PICKUP_AT, RETURN_AT)).extracting(candidate -> candidate.getId()).contains(car.getId());
    }

    @Test
    void shouldAllowAdjacentNonOverlappingPeriod() {
        saveReservation(PICKUP_AT.minusSeconds(86400), PICKUP_AT, ReservationStatus.RESERVED);

        assertThat(search(PICKUP_AT, RETURN_AT)).extracting(candidate -> candidate.getId()).contains(car.getId());
    }

    private java.util.List<Car> search(Instant pickupAt, Instant returnAt) {
        return carRepository.search(null, null, null, true, pickupAt, returnAt);
    }

    private Reservation saveReservation(Instant pickupAt, Instant returnAt, ReservationStatus status) {
        MileagePackage mileagePackage = mileagePackageRepository.findById(1L).orElseThrow();
        Reservation reservation = new Reservation();
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
        return reservationRepository.saveAndFlush(reservation);
    }

    private User user() {
        String id = UUID.randomUUID().toString();
        User createdUser = new User();
        createdUser.setKeycloakId(id);
        createdUser.setEmail(id + "@example.com");
        createdUser.setDriverLicenseNumber(id);
        return createdUser;
    }
}
