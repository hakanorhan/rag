package com.example.aiservice.errorhandling;

import java.net.URI;
import java.util.Locale;

import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.aiservice.AiAdminController;
import com.example.aiservice.AiConfigurationError;
import com.example.aiservice.AiConfigurationException;
import com.example.aiservice.car.CarSearchController;
import com.example.aiservice.rag.ChatController;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice(assignableTypes = {
        AiAdminController.class,
        CarSearchController.class,
        ChatController.class
})
public class AiConfigurationExceptionHandler {

    @ExceptionHandler(AiConfigurationException.class)
    public ProblemDetail handleAiConfigurationException(
            AiConfigurationException exception,
            HttpServletRequest request
    ) {
        AiConfigurationError error = exception.getError();
        String title = switch (error) {
            case PROVIDER_NOT_CONFIGURED -> "AI-Provider nicht konfiguriert";
            case INVALID_CONFIGURATION -> "Ungültige AI-Konfiguration";
        };
        String detail = switch (error) {
            case PROVIDER_NOT_CONFIGURED -> "Der AI-Provider ist nicht konfiguriert.";
            case INVALID_CONFIGURATION -> "Die AI-Konfiguration ist ungültig.";
        };
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(error.getStatus(), detail);
        problem.setType(URI.create("/problems/"
                + error.name().toLowerCase(Locale.ROOT).replace('_', '-')));
        problem.setTitle(title);
        problem.setInstance(URI.create(request.getRequestURI()));
        problem.setProperty("code", error.name());
        return problem;
    }
}
