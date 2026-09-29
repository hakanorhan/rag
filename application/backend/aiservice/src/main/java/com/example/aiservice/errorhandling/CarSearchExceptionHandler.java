package com.example.aiservice.errorhandling;

import java.net.URI;
import java.util.Locale;

import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.aiservice.car.CarSearchController;
import com.example.aiservice.car.CarSearchError;
import com.example.aiservice.car.CarSearchException;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice(assignableTypes = CarSearchController.class)
public class CarSearchExceptionHandler {

    @ExceptionHandler(CarSearchException.class)
    public ProblemDetail handleCarSearchException(
            CarSearchException exception,
            HttpServletRequest request
    ) {
        CarSearchError error = exception.getError();
        String title = switch (error) {
            case SEARCH_PARAMETERS_UNAVAILABLE -> "Suchparameter nicht verfügbar";
            case INVALID_RENTAL_PERIOD -> "Ungültiger Mietzeitraum";
        };
        String detail = switch (error) {
            case SEARCH_PARAMETERS_UNAVAILABLE -> "Suchparameter konnten nicht ermittelt werden.";
            case INVALID_RENTAL_PERIOD -> "Der Abhol- und Rückgabezeitraum ist ungültig.";
        };
        URI type = URI.create("/problems/"
                + error.name().toLowerCase(Locale.ROOT).replace('_', '-'));

        ProblemDetail problem = ProblemDetail.forStatusAndDetail(error.getStatus(), detail);
        problem.setType(type);
        problem.setTitle(title);
        problem.setInstance(URI.create(request.getRequestURI()));
        problem.setProperty("code", error.name());
        return problem;
    }
}
