package com.example.aiservice.rag;

import lombok.Getter;

@Getter
public class RagDocumentException extends RuntimeException {

    private final RagDocumentError error;

    public RagDocumentException(RagDocumentError error) {
        super(error.name());
        this.error = error;
    }

    public RagDocumentException(RagDocumentError error, Throwable cause) {
        super(error.name(), cause);
        this.error = error;
    }
}
