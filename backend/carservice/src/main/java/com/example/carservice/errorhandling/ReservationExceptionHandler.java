package com.example.carservice.errorhandling;

import java.net.URI;
import java.sql.SQLException;

import org.springframework.dao.CannotAcquireLockException;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.carservice.reservation.ReservationController;

@RestControllerAdvice(assignableTypes = ReservationController.class)
public class ReservationExceptionHandler {

    @ExceptionHandler({DataIntegrityViolationException.class, CannotAcquireLockException.class})
    public ProblemDetail handleReservationConflict(DataAccessException ex) {
        if (ex.getMostSpecificCause() instanceof SQLException sqlException
                && ("23P01".equals(sqlException.getSQLState())
                    || "40P01".equals(sqlException.getSQLState()))) {
            var problem = ProblemDetail.forStatusAndDetail(
                    HttpStatus.CONFLICT,
                    "Das Fahrzeug ist in diesem Zeitraum bereits reserviert."
            );
            problem.setType(URI.create("/problems/car-unavailable"));
            problem.setTitle("Fahrzeug nicht verfügbar");
            return problem;
        }

        throw ex;
    }
}
