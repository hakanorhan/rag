package com.example.carservice.reservation;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.carservice.car.CarRepository;
import com.example.commonlib.car.CarStatus;
import com.example.carservice.car.LocationRepository;
import com.example.carservice.car.UserRepository;
import com.example.carservice.car.ExtraRepository;
import com.example.carservice.car.ReservationExtra;
import com.example.carservice.car.ReservationStatus;

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
        var user = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Kein Kundenkonto zugeordnet."));
        if (idempotencyKey != null) {
            var existing = repository.findByUserKeycloakIdAndIdempotencyKey(keycloakId, idempotencyKey);
            if (existing.isPresent()) return existing.get().getId();
        }
        var car = carRepository.findById(request.carId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Fahrzeug nicht gefunden."));
        var pickupLocation = locationRepository.findById(request.pickUpLocationId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Abholort nicht gefunden."));
        var returnLocation = locationRepository.findById(request.returnLocationId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rückgabeort nicht gefunden."));

        if (car.getStatus() != CarStatus.AVAILABLE) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Fahrzeug ist nicht verfügbar.");
        }
        if (!car.getLocation().getId().equals(pickupLocation.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Fahrzeug ist an der Abholstation nicht verfügbar.");
        }

        var mileagePackage = mileagePackageRepository.findById(request.mileagePackageId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Kilometerpaket nicht gefunden."));
        var extras = extraRepository.findAllById(request.extraIds());
        if (extras.size() != request.extraIds().size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Extra nicht gefunden.");
        }

        var reservation = new Reservation();
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
        for (var extra : extras) {
            var selected = new ReservationExtra();
            selected.setReservation(reservation);
            selected.setExtra(extra);
            selected.setUnitPrice(extra.getPricePerDay());
            reservation.getExtras().add(selected);
        }
        var extrasPerDay = reservation.getExtras().stream()
                .map(ReservationExtra::getUnitPrice).reduce(BigDecimal.ZERO, BigDecimal::add);
        reservation.setTotalPrice(reservation.getDailyRate().add(reservation.getMileagePricePerDay()).add(extrasPerDay)
                .multiply(BigDecimal.valueOf(reservation.getRentalDays())));

        return repository.save(reservation).getId();
    }

    @Transactional
    public ReservationDTO getReservation(Long reservationId, String keycloakId) {
        var reservation = repository.findById(reservationId)
                .filter(value -> keycloakId.equals(value.getUser().getKeycloakId()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservierung nicht gefunden."));

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
        var reservation = repository.findOwnedForUpdate(reservationId, keycloakId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservierung nicht gefunden."));
        if (reservation.getStatus() != ReservationStatus.RESERVED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Diese Reservierung kann nicht mehr geändert werden.");
        }
        var mileagePackage = mileagePackageRepository.findById(request.mileagePackageId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Kilometerpaket nicht gefunden."));
        var extras = extraRepository.findAllById(request.extraIds());
        if (extras.size() != request.extraIds().size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Extra nicht gefunden.");
        }

        if (!reservation.getMileagePackage().getId().equals(mileagePackage.getId())) {
            reservation.setMileagePackage(mileagePackage);
            reservation.setIncludedKmPerDay(mileagePackage.getIncludedKmPerDay());
            reservation.setMileagePricePerDay(mileagePackage.getPricePerDay());
        }
        reservation.getExtras().removeIf(selected -> !request.extraIds().contains(selected.getExtra().getId()));
        for (var extra : extras) {
            boolean alreadySelected = reservation.getExtras().stream()
                    .anyMatch(selected -> selected.getExtra().getId().equals(extra.getId()));
            if (!alreadySelected) {
                var selected = new ReservationExtra();
                selected.setReservation(reservation);
                selected.setExtra(extra);
                selected.setUnitPrice(extra.getPricePerDay());
                reservation.getExtras().add(selected);
            }
        }
        var extrasPerDay = reservation.getExtras().stream()
                .map(ReservationExtra::getUnitPrice).reduce(BigDecimal.ZERO, BigDecimal::add);
        var dailyTotal = reservation.getDailyRate().add(reservation.getMileagePricePerDay()).add(extrasPerDay);
        reservation.setTotalPrice(dailyTotal.multiply(BigDecimal.valueOf(reservation.getRentalDays())));
        return ReservationMapper.toDTO(reservation);
    }
}
