package com.example.aiservice.errorhandling;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

import com.example.aiservice.rag.RagDocumentError;
import com.example.aiservice.rag.RagDocumentException;

class RagDocumentExceptionHandlerTest {

    private final RagDocumentExceptionHandler handler = new RagDocumentExceptionHandler();

    @ParameterizedTest
    @EnumSource(RagDocumentError.class)
    void shouldReturnTypedProblemDetailWithSeparateMachineReadableCode(RagDocumentError error) {
        var problem = handler.handleRagDocumentException(new RagDocumentException(error));

        assertThat(problem.getType().toString()).startsWith("/problems/");
        assertThat(problem.getTitle()).isNotBlank();
        assertThat(problem.getDetail()).isNotBlank().isNotEqualTo(error.name());
        assertThat(problem.getProperties()).containsEntry("code", error.name());
    }
}
