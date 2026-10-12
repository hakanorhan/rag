package com.example.carservice.errorhandling;

import java.sql.SQLException;

import org.springframework.dao.CannotAcquireLockException;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.carservice.reservation.ReservationController;
import com.example.carservice.payment.paypal.PaypalController;
import com.example.carservice.reservation.ReservationError;
import com.example.carservice.reservation.ReservationException;
import com.example.commonlib.errorhandling.ProblemDetails;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice(assignableTypes = {ReservationController.class, PaypalController.class})
public class ReservationExceptionHandler {

    @ExceptionHandler(ReservationException.class)
    public ProblemDetail handleReservationException(
            ReservationException exception,
            HttpServletRequest request
    ) {
        return createProblem(exception.getError(), request);
    }

    @ExceptionHandler({DataIntegrityViolationException.class, CannotAcquireLockException.class})
    public ProblemDetail handleReservationConflict(DataAccessException ex, HttpServletRequest request) {
        if (ex.getMostSpecificCause() instanceof SQLException sqlException
                && ("23P01".equals(sqlException.getSQLState())
                    || "40P01".equals(sqlException.getSQLState()))) {
            return createProblem(ReservationError.CAR_UNAVAILABLE, request);
        }

        throw ex;
    }

    private ProblemDetail createProblem(ReservationError error, HttpServletRequest request) {
        String title = switch (error) {
            case DRIVER_LICENSE_REQUIRED -> "Führerscheinnummer erforderlich";
            case CAR_NOT_FOUND -> "Fahrzeug nicht gefunden";
            case PICKUP_LOCATION_NOT_FOUND -> "Abholort nicht gefunden";
            case RETURN_LOCATION_NOT_FOUND -> "Rückgabeort nicht gefunden";
            case CAR_UNAVAILABLE -> "Fahrzeug nicht verfügbar";
            case MILEAGE_PACKAGE_NOT_FOUND -> "Kilometerpaket nicht gefunden";
            case EXTRA_NOT_FOUND -> "Extra nicht gefunden";
            case RESERVATION_NOT_FOUND -> "Reservierung nicht gefunden";
            case RESERVATION_NOT_EDITABLE -> "Reservierung nicht änderbar";
        };
        String detail = switch (error) {
            case DRIVER_LICENSE_REQUIRED ->
                    "Für eine Reservierung ist eine Führerscheinnummer erforderlich.";
            case CAR_NOT_FOUND -> "Das angeforderte Fahrzeug wurde nicht gefunden.";
            case PICKUP_LOCATION_NOT_FOUND -> "Der angeforderte Abholort wurde nicht gefunden.";
            case RETURN_LOCATION_NOT_FOUND -> "Der angeforderte Rückgabeort wurde nicht gefunden.";
            case CAR_UNAVAILABLE -> "Das Fahrzeug ist für diese Reservierung nicht verfügbar.";
            case MILEAGE_PACKAGE_NOT_FOUND -> "Das angeforderte Kilometerpaket wurde nicht gefunden.";
            case EXTRA_NOT_FOUND -> "Mindestens ein angefordertes Extra wurde nicht gefunden.";
            case RESERVATION_NOT_FOUND -> "Die angeforderte Reservierung wurde nicht gefunden.";
            case RESERVATION_NOT_EDITABLE -> "Diese Reservierung kann nicht mehr geändert werden.";
        };
        return ProblemDetails.create(error.getStatus(), error.name(), title, detail, request);
    }
}
