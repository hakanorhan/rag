package com.example.carservice.errorhandling;

import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.carservice.reservation.ReservationController;

@RestControllerAdvice(assignableTypes = ReservationController.class)
public class ReservationExceptionHandler {

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ProblemDetail handleConstraintViolation(DataIntegrityViolationException ex) {
        if (ex.getCause() instanceof ConstraintViolationException violation
                && "23P01".equals(violation.getSQLState())) {
            var problem = ProblemDetail.forStatusAndDetail(
                    HttpStatus.CONFLICT,
                    "Das Fahrzeug ist in diesem Zeitraum bereits reserviert."
            );
            problem.setTitle("Fahrzeug nicht verfügbar");
            return problem;
        }

        throw ex;
    }
}
