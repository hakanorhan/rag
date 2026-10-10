package com.example.carservice.reservation;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
public class ReservationController {

    private final ReservationService reservationService;

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/reservations")
    public ResponseEntity<List<ReservationDTO>> getReservations(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page
    ) {
        Page<ReservationDTO> reservations = reservationService.getReservations(
                authentication.getName(), Math.max(0, page));
        return ResponseEntity.ok()
                .header("X-Total-Pages", String.valueOf(reservations.getTotalPages()))
                .body(reservations.getContent());
    }

    @GetMapping("/reservation/options")
    public ReservationOptionsDTO getOptions() {
        return reservationService.getOptions();
    }

    @PreAuthorize("hasRole('USER')")
    @PutMapping("/reservation/{reservationId}/options")
    public ReservationDTO updateOptions(
            @PathVariable Long reservationId,
            @Valid @RequestBody UpdateReservationOptionsRequest request,
            Authentication authentication
    ) {
        return reservationService.updateOptions(reservationId, request, authentication.getName());
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping({"/reservation", "/reservations"})
    public Long reservationCar(
            @Valid @RequestBody ReservationCarRequest request,
            Authentication authentication,
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey
    ) {
        return reservationService.doReservation(request, authentication.getName(), idempotencyKey);
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/reservation/{reservationId}")
    public ReservationDTO getReservation(
            @PathVariable Long reservationId,
            Authentication authentication
    ) {
        return reservationService.getReservation(reservationId, authentication.getName());
    }
}
