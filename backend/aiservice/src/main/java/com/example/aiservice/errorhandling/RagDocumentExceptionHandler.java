package com.example.aiservice.errorhandling;

import java.net.URI;
import java.util.Locale;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.aiservice.rag.RagAdminController;
import com.example.aiservice.rag.RagDocumentException;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice(assignableTypes = RagAdminController.class)
public class RagDocumentExceptionHandler {

    @ExceptionHandler(RagDocumentException.class)
    public ProblemDetail handleRagDocumentException(
            RagDocumentException exception,
            HttpServletRequest request
    ) {
        HttpStatus status = switch (exception.getError()) {
            case INVALID_PDF -> HttpStatus.BAD_REQUEST;
            case DOCUMENT_NOT_FOUND -> HttpStatus.NOT_FOUND;
            case VERSION_CONFLICT, DOCUMENT_ALREADY_EXISTS -> HttpStatus.CONFLICT;
        };

        String title = switch (exception.getError()) {
            case INVALID_PDF -> "Ungültige PDF-Datei";
            case DOCUMENT_NOT_FOUND -> "Dokument nicht gefunden";
            case VERSION_CONFLICT -> "Versionskonflikt";
            case DOCUMENT_ALREADY_EXISTS -> "Dokument bereits vorhanden";
        };

        URI type = URI.create("/problems/"
                + exception.getError().name().toLowerCase(Locale.ROOT).replace('_', '-'));
        String detail = switch (exception.getError()) {
            case INVALID_PDF -> "Die hochgeladene Datei ist keine gültige PDF-Datei.";
            case DOCUMENT_NOT_FOUND -> "Das angeforderte Dokument wurde nicht gefunden.";
            case VERSION_CONFLICT ->
                    "Das Dokument wurde zwischenzeitlich geändert. Lade den aktuellen Stand und versuche es erneut.";
            case DOCUMENT_ALREADY_EXISTS -> "Ein Dokument mit demselben Inhalt ist bereits vorhanden.";
        };

        ProblemDetail problem = ProblemDetail.forStatusAndDetail(status, detail);
        problem.setType(type);
        problem.setTitle(title);
        problem.setInstance(URI.create(request.getRequestURI()));
        problem.setProperty("code", exception.getError().name());
        return problem;
    }
}
