package com.example.carservice.errorhandling;

import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.carservice.user.UserController;
import com.example.carservice.user.UserProfileError;
import com.example.carservice.user.UserProfileException;
import com.example.commonlib.errorhandling.ProblemDetails;

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
        return ProblemDetails.create(error.getStatus(), error.name(), title, detail, request);
    }
}
