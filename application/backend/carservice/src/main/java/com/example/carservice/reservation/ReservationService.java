package com.example.carservice.reservation;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.carservice.car.Car;
import com.example.carservice.car.CarRepository;
import com.example.carservice.car.Extra;
import com.example.carservice.car.ExtraRepository;
import com.example.carservice.car.Location;
import com.example.carservice.car.LocationRepository;
import com.example.carservice.car.ReservationExtra;
import com.example.carservice.car.ReservationStatus;
import com.example.carservice.car.User;
import com.example.carservice.car.UserRepository;
import com.example.commonlib.car.CarStatus;

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

    @Transactional
    public Long doReservation(ReservationCarRequest request, String keycloakId, String idempotencyKey) {
        User user = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new ReservationException(ReservationError.DRIVER_LICENSE_REQUIRED));
        if (user.getDriverLicenseNumber() == null || user.getDriverLicenseNumber().isBlank()) {
            throw new ReservationException(ReservationError.DRIVER_LICENSE_REQUIRED);
        }
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

        if (car.getStatus() != CarStatus.AVAILABLE) {
            throw new ReservationException(ReservationError.CAR_UNAVAILABLE);
        }
        if (!car.getLocation().getId().equals(pickupLocation.getId())) {
            throw new ReservationException(ReservationError.CAR_UNAVAILABLE);
        }

        MileagePackage mileagePackage = mileagePackageRepository.findById(request.mileagePackageId())
                .orElseThrow(() -> new ReservationException(ReservationError.MILEAGE_PACKAGE_NOT_FOUND));
         List<Extra> extras = extraRepository.findAllById(request.extraIds());
        if (extras.size() != request.extraIds().size()) {
            throw new ReservationException(ReservationError.EXTRA_NOT_FOUND);
        }

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setCar(car);
        reservation.setPickupLocation(pickupLocation);
        reservation.setReturnLocation(returnLocation);
        reservation.setPickupAt(request.pickupAt());
        reservation.setReturnAt(request.returnAt());
        reservation.setDailyRate(car.getCarType().getDailyRate());
        reservation.setMileagePackage(mileagePackage);
        reservation.setIncludedKmPerDay(mileagePackage.getIncludedKmPerDay());
        reservation.setMileagePricePerDay(mileagePackage.getPricePerDay());
        reservation.setSearchQuery(request.searchQuery());
        reservation.setIdempotencyKey(idempotencyKey);
        for (Extra extra : extras) {
            ReservationExtra selected = new ReservationExtra();
            selected.setReservation(reservation);
            selected.setExtra(extra);
            selected.setUnitPrice(extra.getPricePerDay());
            reservation.getExtras().add(selected);
        }
        BigDecimal extrasPerDay = reservation.getExtras().stream()
                .map(extra -> extra.getUnitPrice()).reduce(BigDecimal.ZERO, (left, right) -> left.add(right));
        reservation.setTotalPrice(reservation.getDailyRate().add(reservation.getMileagePricePerDay()).add(extrasPerDay)
                .multiply(BigDecimal.valueOf(reservation.getRentalDays())));

        return repository.save(reservation).getId();
    }

    @Transactional
    public ReservationDTO getReservation(Long reservationId, String keycloakId) {
        Reservation reservation = repository.findById(reservationId)
                .filter(value -> keycloakId.equals(value.getUser().getKeycloakId()))
                .orElseThrow(() -> new ReservationException(ReservationError.RESERVATION_NOT_FOUND));

        return ReservationMapper.toDTO(reservation);
    }

    @Transactional
    public List<ReservationDTO> getReservations(String keycloakId) {
        return repository.findAllByUserKeycloakIdOrderByPickupAtDesc(keycloakId)
                .stream()
                .map(ReservationMapper::toDTO)
                .toList();
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
        MileagePackage mileagePackage = mileagePackageRepository.findById(request.mileagePackageId())
                .orElseThrow(() -> new ReservationException(ReservationError.MILEAGE_PACKAGE_NOT_FOUND));
        List<Extra> extras = extraRepository.findAllById(request.extraIds());
        if (extras.size() != request.extraIds().size()) {
            throw new ReservationException(ReservationError.EXTRA_NOT_FOUND);
        }

        if (!reservation.getMileagePackage().getId().equals(mileagePackage.getId())) {
            reservation.setMileagePackage(mileagePackage);
            reservation.setIncludedKmPerDay(mileagePackage.getIncludedKmPerDay());
            reservation.setMileagePricePerDay(mileagePackage.getPricePerDay());
        }
        reservation.getExtras().removeIf(selected -> !request.extraIds().contains(selected.getExtra().getId()));
        for (Extra extra : extras) {
            boolean alreadySelected = reservation.getExtras().stream()
                    .anyMatch(selected -> selected.getExtra().getId().equals(extra.getId()));
            if (!alreadySelected) {
                ReservationExtra selected = new ReservationExtra();
                selected.setReservation(reservation);
                selected.setExtra(extra);
                selected.setUnitPrice(extra.getPricePerDay());
                reservation.getExtras().add(selected);
            }
        }
        BigDecimal extrasPerDay = reservation.getExtras().stream()
                .map(extra -> extra.getUnitPrice()).reduce(BigDecimal.ZERO, (left, right) -> left.add(right));
        BigDecimal dailyTotal = reservation.getDailyRate().add(reservation.getMileagePricePerDay()).add(extrasPerDay);
        reservation.setTotalPrice(dailyTotal.multiply(BigDecimal.valueOf(reservation.getRentalDays())));
        return ReservationMapper.toDTO(reservation);
    }
}
