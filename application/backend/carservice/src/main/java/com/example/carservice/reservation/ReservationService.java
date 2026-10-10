package com.example.carservice.reservation;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import com.example.carservice.payment.entity.PaymentStatus;
import com.example.carservice.payment.repository.PaymentRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.carservice.car.Car;
import com.example.carservice.car.CarRepository;
import com.example.carservice.car.Extra;
import com.example.carservice.car.ExtraRepository;
import com.example.carservice.car.Location;
import com.example.carservice.car.LocationRepository;
import com.example.carservice.car.ReservationStatus;
import com.example.carservice.car.User;
import com.example.carservice.car.UserRepository;
import com.example.commonlib.car.CarStatus;
import com.example.commonlib.kafka.ReservedConfirmation;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class ReservationService {

    private final ReservationRepository repository;
    private final CarRepository carRepository;
    private final LocationRepository locationRepository;
    private final UserRepository userRepository;
    private final MileagePackageRepository mileagePackageRepository;
    private final ExtraRepository extraRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final PaymentRepository paymentRepository;
    private final ReservationPricing pricing;

    @Transactional
    public Long doReservation(ReservationCarRequest request, String keycloakId, String idempotencyKey) {
        User user = requireLicensedUser(keycloakId);
        if (idempotencyKey != null) {
            Optional<Reservation> existing = repository.findByUserKeycloakIdAndIdempotencyKey(keycloakId, idempotencyKey);
            if (existing.isPresent()) return existing.get().getId();
        }
        Car car = carRepository.findById(request.carId())
                .orElseThrow(() -> new ReservationException(ReservationError.CAR_NOT_FOUND));
        Location pickupLocation = locationRepository.findById(request.pickUpLocationId())
                .orElseThrow(() -> new ReservationException(ReservationError.PICKUP_LOCATION_NOT_FOUND));
        Location returnLocation = locationRepository.findById(request.returnLocationId())
                .orElseThrow(() -> new ReservationException(ReservationError.RETURN_LOCATION_NOT_FOUND));

        requireAvailableCarAtPickup(car, pickupLocation);

        MileagePackage mileagePackage = mileagePackageRepository.findById(request.mileagePackageId())
                .orElseThrow(() -> new ReservationException(ReservationError.MILEAGE_PACKAGE_NOT_FOUND));
        List<Extra> extras = requireExtras(request.extraIds());

        Reservation reservation = ReservationMapper.toEntity(
                request,
                user,
                car,
                pickupLocation,
                returnLocation,
                mileagePackage,
                extras,
                idempotencyKey
        );
        pricing.recalculateTotal(reservation);

        Reservation saved = repository.save(reservation);
        eventPublisher.publishEvent(new ReservedConfirmation(saved.getId(), user.getEmail()));
        return saved.getId();
    }

    @Transactional
    public ReservationDTO getReservation(Long reservationId, String keycloakId) {
        Reservation reservation = repository.findById(reservationId)
                .filter(value -> keycloakId.equals(value.getUser().getKeycloakId()))
                .orElseThrow(() -> new ReservationException(ReservationError.RESERVATION_NOT_FOUND));

        return ReservationMapper.toDTO(reservation);
    }

    @Transactional
    public Page<ReservationDTO> getReservations(String keycloakId, int page) {
        return repository.findByUserKeycloakId(
                keycloakId,
                PageRequest.of(page, 3, Sort.by(Sort.Direction.DESC, "pickupAt", "id"))
        ).map(ReservationMapper::toDTO);
    }

    @Transactional
    public ReservationOptionsDTO getOptions() {
        return new ReservationOptionsDTO(
                mileagePackageRepository.findAllByOrderByIdAsc().stream().map(option ->
                        new ReservationOptionsDTO.MileageOption(option.getId(), option.getName(),
                                option.getIncludedKmPerDay(), option.getPricePerDay())).toList(),
                extraRepository.findAllByOrderByIdAsc().stream().map(extra ->
                        new ReservationOptionsDTO.ExtraOption(extra.getId(), extra.getName(),
                                extra.getDescription(), extra.getPricePerDay())).toList()
        );
    }

    @Transactional
    public ReservationDTO updateOptions(Long reservationId, UpdateReservationOptionsRequest request, String keycloakId) {
        Reservation reservation = repository.findOwnedForUpdate(reservationId, keycloakId)
                .orElseThrow(() -> new ReservationException(ReservationError.RESERVATION_NOT_FOUND));
        if (reservation.getStatus() != ReservationStatus.RESERVED) {
            throw new ReservationException(ReservationError.RESERVATION_NOT_EDITABLE);
        }
        if (paymentRepository.existsByReservationIdAndStatus(reservationId, PaymentStatus.COMPLETED)) {
            throw new ReservationException(ReservationError.RESERVATION_NOT_EDITABLE);
        }
        MileagePackage mileagePackage = mileagePackageRepository.findById(request.mileagePackageId())
                .orElseThrow(() -> new ReservationException(ReservationError.MILEAGE_PACKAGE_NOT_FOUND));
        List<Extra> extras = requireExtras(request.extraIds());

        pricing.applyOptions(reservation, mileagePackage, request.extraIds(), extras);

        return ReservationMapper.toDTO(reservation);
    }

    private User requireLicensedUser(String keycloakId) {
        User user = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new ReservationException(ReservationError.DRIVER_LICENSE_REQUIRED));
        if (user.getDriverLicenseNumber() == null || user.getDriverLicenseNumber().isBlank()) {
            throw new ReservationException(ReservationError.DRIVER_LICENSE_REQUIRED);
        }
        return user;
    }

    private void requireAvailableCarAtPickup(Car car, Location pickupLocation) {
        if (car.getStatus() != CarStatus.AVAILABLE
                || !car.getLocation().getId().equals(pickupLocation.getId())) {
            throw new ReservationException(ReservationError.CAR_UNAVAILABLE);
        }
    }

    private List<Extra> requireExtras(Set<Long> extraIds) {
        List<Extra> extras = extraRepository.findAllById(extraIds);
        if (extras.size() != extraIds.size()) {
            throw new ReservationException(ReservationError.EXTRA_NOT_FOUND);
        }
        return extras;
    }
}
