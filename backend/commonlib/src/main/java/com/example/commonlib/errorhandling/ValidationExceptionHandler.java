package com.example.commonlib.errorhandling;

import java.net.URI;
import java.util.List;
import java.util.Objects;

import org.springframework.context.MessageSourceResolvable;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class ValidationExceptionHandler {

    private static final URI VALIDATION_ERROR_TYPE = URI.create("/problems/validation-error");

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleArgumentValidation(
            MethodArgumentNotValidException exception,
            HttpServletRequest request
    ) {
        return createProblem(exception.getBindingResult().getAllErrors(), request);
    }

    @ExceptionHandler(HandlerMethodValidationException.class)
    public ProblemDetail handleMethodValidation(
            HandlerMethodValidationException exception,
            HttpServletRequest request
    ) {
        return createProblem(exception.getAllErrors(), request);
    }

    private ProblemDetail createProblem(
            List<? extends MessageSourceResolvable> validationErrors,
            HttpServletRequest request
    ) {
        List<String> errors = validationErrors.stream()
                .map(MessageSourceResolvable::getDefaultMessage)
                .filter(Objects::nonNull)
                .toList();

        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                "Mindestens ein Eingabewert ist ungültig."
        );
        problem.setType(VALIDATION_ERROR_TYPE);
        problem.setTitle("Ungültige Anfrage");
        problem.setInstance(URI.create(request.getRequestURI()));
        problem.setProperty("code", "VALIDATION_ERROR");
        problem.setProperty("errors", errors);
        return problem;
    }
}
