package com.example.carservice.errorhandling;

import java.net.URI;
import java.util.Locale;

import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.carservice.car.UserController;
import com.example.carservice.car.UserProfileError;
import com.example.carservice.car.UserProfileException;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice(assignableTypes = UserController.class)
public class UserProfileExceptionHandler {

    @ExceptionHandler(UserProfileException.class)
    public ProblemDetail handleUserProfileException(
            UserProfileException exception,
            HttpServletRequest request
    ) {
        UserProfileError error = exception.getError();
        String title = switch (error) {
            case KEYCLOAK_EMAIL_REQUIRED -> "E-Mail-Adresse erforderlich";
            case USER_PROFILE_CONFLICT -> "Profildaten bereits vergeben";
        };
        String detail = switch (error) {
            case KEYCLOAK_EMAIL_REQUIRED -> "Im Keycloak-Konto fehlt die E-Mail-Adresse.";
            case USER_PROFILE_CONFLICT ->
                    "Diese E-Mail-Adresse oder Führerscheinnummer wird bereits verwendet.";
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
