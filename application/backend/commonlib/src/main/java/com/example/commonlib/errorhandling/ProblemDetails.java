package com.example.commonlib.errorhandling;

import java.net.URI;
import java.util.Locale;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;

import jakarta.servlet.http.HttpServletRequest;

public final class ProblemDetails {

    private ProblemDetails() {
    }

    public static ProblemDetail create(HttpStatusCode status, String code, String title, String detail,
            HttpServletRequest request) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(status, detail);
        problem.setType(URI.create("/problems/" + code.toLowerCase(Locale.ROOT).replace('_', '-')));
        problem.setTitle(title);
        problem.setInstance(URI.create(request.getRequestURI()));
        problem.setProperty("code", code);
        return problem;
    }
}
