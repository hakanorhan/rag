package com.example.carservice.reservation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Optional;
import java.util.Set;

import com.example.carservice.car.Car;
import com.example.carservice.car.CarRepository;
import com.example.carservice.car.CarType;
import com.example.carservice.car.ExtraRepository;
import com.example.carservice.car.Location;
import com.example.carservice.car.LocationRepository;
import com.example.carservice.car.ReservationStatus;
import com.example.carservice.car.User;
import com.example.carservice.car.UserRepository;
import com.example.commonlib.car.CarStatus;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

@ExtendWith(MockitoExtension.class)
class ReservationServiceTest {

    private static final String KEYCLOAK_ID = "owner-subject";

    @Mock
    ReservationRepository reservationRepository;

    @Mock
    CarRepository carRepository;

    @Mock
    LocationRepository locationRepository;

    @Mock
    UserRepository userRepository;

    @Mock
    MileagePackageRepository mileagePackageRepository;

    @Mock
    ExtraRepository extraRepository;

    private ReservationService reservationService;
    private User user;
    private Car car;
    private Location pickupLocation;
    private Location returnLocation;

    @BeforeEach
    void setUp() {
        reservationService = new ReservationService(
                reservationRepository,
                carRepository,
                locationRepository,
                userRepository,
                mileagePackageRepository,
                extraRepository
        );

        user = new User();
        user.setId(1L);
        user.setKeycloakId(KEYCLOAK_ID);
        user.setDriverLicenseNumber("TEST-LICENSE");

        pickupLocation = location(1L, "Düsseldorf");
        returnLocation = location(2L, "Essen");

        var carType = new CarType();
        carType.setDailyRate(new BigDecimal("149.90"));

        car = new Car();
        car.setId(1L);
        car.setStatus(CarStatus.AVAILABLE);
        car.setLocation(pickupLocation);
        car.setCarType(carType);
    }

    @Test
    void shouldRejectReservationAtWrongPickupLocation() {
        var wrongPickupLocation = location(3L, "Köln");
        when(userRepository.findByKeycloakId(KEYCLOAK_ID)).thenReturn(Optional.of(user));
        when(carRepository.findById(1L)).thenReturn(Optional.of(car));
        when(locationRepository.findById(3L)).thenReturn(Optional.of(wrongPickupLocation));
        when(locationRepository.findById(2L)).thenReturn(Optional.of(returnLocation));

        assertStatus(HttpStatus.CONFLICT, () -> reservationService.doReservation(request(1L, 3L, 2L), KEYCLOAK_ID, null));

        verifyNoInteractions(reservationRepository);
    }

    @Test
    void shouldRejectMissingCar() {
        when(userRepository.findByKeycloakId(KEYCLOAK_ID)).thenReturn(Optional.of(user));
        when(carRepository.findById(99L)).thenReturn(Optional.empty());

        assertStatus(HttpStatus.NOT_FOUND, () -> reservationService.doReservation(request(99L, 1L, 2L), KEYCLOAK_ID, null));

        verifyNoInteractions(locationRepository, mileagePackageRepository);
        verifyNoInteractions(reservationRepository);
    }

    @Test
    void shouldRejectMissingPickupLocation() {
        when(userRepository.findByKeycloakId(KEYCLOAK_ID)).thenReturn(Optional.of(user));
        when(carRepository.findById(1L)).thenReturn(Optional.of(car));
        when(locationRepository.findById(99L)).thenReturn(Optional.empty());

        assertStatus(HttpStatus.NOT_FOUND, () -> reservationService.doReservation(request(1L, 99L, 2L), KEYCLOAK_ID, null));

        verifyNoInteractions(reservationRepository);
    }

    @Test
    void shouldRejectMissingReturnLocation() {
        when(userRepository.findByKeycloakId(KEYCLOAK_ID)).thenReturn(Optional.of(user));
        when(carRepository.findById(1L)).thenReturn(Optional.of(car));
        when(locationRepository.findById(1L)).thenReturn(Optional.of(pickupLocation));
        when(locationRepository.findById(99L)).thenReturn(Optional.empty());

        assertStatus(HttpStatus.NOT_FOUND, () -> reservationService.doReservation(request(1L, 1L, 99L), KEYCLOAK_ID, null));

        verifyNoInteractions(reservationRepository);
    }

    @ParameterizedTest
    @EnumSource(value = ReservationStatus.class, names = {"CANCELLED", "COMPLETED"})
    void shouldRejectOptionChangesForClosedReservation(ReservationStatus status) {
        var reservation = new Reservation();
        reservation.setStatus(status);
        when(reservationRepository.findOwnedForUpdate(1L, KEYCLOAK_ID)).thenReturn(Optional.of(reservation));

        var request = new UpdateReservationOptionsRequest(1L, Set.of());

        assertStatus(HttpStatus.CONFLICT, () -> reservationService.updateOptions(1L, request, KEYCLOAK_ID));
        verifyNoInteractions(mileagePackageRepository, extraRepository);
    }

    private ReservationCarRequest request(long carId, long pickupLocationId, long returnLocationId) {
        return new ReservationCarRequest(
                carId,
                pickupLocationId,
                returnLocationId,
                Instant.parse("2035-09-10T10:00:00Z"),
                Instant.parse("2035-09-11T10:00:00Z"),
                1L,
                Set.of(),
                null
        );
    }

    private Location location(long id, String name) {
        var location = new Location();
        location.setId(id);
        location.setName(name);
        return location;
    }

    private Reservation reservedReservation() {
        var reservation = new Reservation();
        reservation.setStatus(ReservationStatus.RESERVED);
        return reservation;
    }

    private void assertStatus(HttpStatus expected, org.assertj.core.api.ThrowableAssert.ThrowingCallable operation) {
        assertThatThrownBy(operation)
                .isInstanceOfSatisfying(ReservationException.class,
                        exception -> assertThat(exception.getError().getStatus()).isEqualTo(expected));
    }

    @Test
void shouldRejectUnlinkedUser() {
    when(userRepository.findByKeycloakId(KEYCLOAK_ID)).thenReturn(Optional.empty());

    assertStatus(
            HttpStatus.UNPROCESSABLE_CONTENT,
            () -> reservationService.doReservation(request(1L, 1L, 2L), KEYCLOAK_ID, null)
    );
}

@Test
void shouldRejectUnavailableCar() {
    car.setStatus(CarStatus.MAINTENANCE);

    when(userRepository.findByKeycloakId(KEYCLOAK_ID)).thenReturn(Optional.of(user));
    when(carRepository.findById(1L)).thenReturn(Optional.of(car));
    when(locationRepository.findById(1L)).thenReturn(Optional.of(pickupLocation));
    when(locationRepository.findById(2L)).thenReturn(Optional.of(returnLocation));

    assertStatus(
            HttpStatus.CONFLICT,
            () -> reservationService.doReservation(request(1L, 1L, 2L), KEYCLOAK_ID, null)
    );
}

@Test
void shouldFailWhenDefaultMileagePackageIsMissing() {
    when(userRepository.findByKeycloakId(KEYCLOAK_ID)).thenReturn(Optional.of(user));
    when(carRepository.findById(1L)).thenReturn(Optional.of(car));
    when(locationRepository.findById(1L)).thenReturn(Optional.of(pickupLocation));
    when(locationRepository.findById(2L)).thenReturn(Optional.of(returnLocation));
    when(mileagePackageRepository.findById(1L)).thenReturn(Optional.empty());

    assertStatus(
            HttpStatus.BAD_REQUEST,
            () -> reservationService.doReservation(request(1L, 1L, 2L), KEYCLOAK_ID, null)
    );
}

@Test
void shouldRejectUnknownMileagePackage() {
    var reservation = reservedReservation();

    when(reservationRepository.findOwnedForUpdate(1L, KEYCLOAK_ID))
            .thenReturn(Optional.of(reservation));
    when(mileagePackageRepository.findById(999L))
            .thenReturn(Optional.empty());

    var request = new UpdateReservationOptionsRequest(999L, Set.of());

    assertStatus(
            HttpStatus.BAD_REQUEST,
            () -> reservationService.updateOptions(1L, request, KEYCLOAK_ID)
    );
}

@Test
void shouldRejectUnknownExtra() {
    var reservation = reservedReservation();

    var mileagePackage = new MileagePackage();
    mileagePackage.setId(1L);

    when(reservationRepository.findOwnedForUpdate(1L, KEYCLOAK_ID))
            .thenReturn(Optional.of(reservation));
    when(mileagePackageRepository.findById(1L))
            .thenReturn(Optional.of(mileagePackage));

    // Request enthält 2 Extras, Repository findet aber nur eines.
    when(extraRepository.findAllById(Set.of(1L, 999L)))
            .thenReturn(java.util.List.of(new com.example.carservice.car.Extra()));

    var request = new UpdateReservationOptionsRequest(
            1L,
            Set.of(1L, 999L)
    );

    assertStatus(
            HttpStatus.BAD_REQUEST,
            () -> reservationService.updateOptions(1L, request, KEYCLOAK_ID)
    );
}

@Test
void shouldHideReservationFromWrongOwnerWhenUpdatingOptions() {
    when(reservationRepository.findOwnedForUpdate(1L, "stranger-subject"))
            .thenReturn(Optional.empty());

    var request = new UpdateReservationOptionsRequest(1L, Set.of());

    assertStatus(
            HttpStatus.NOT_FOUND,
            () -> reservationService.updateOptions(
                    1L,
                    request,
                    "stranger-subject"
            )
    );
}
}
