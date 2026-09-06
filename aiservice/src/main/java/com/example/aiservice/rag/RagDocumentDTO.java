package com.example.aiservice.rag;

import java.time.Instant;
import java.util.UUID;

public record RagDocumentDTO(UUID id, RagCategory category, String filename, long sizeBytes,
        String sha256, int version, int pageCount, int chunkCount, Instant createdAt, Instant updatedAt) {

    public static RagDocumentDTO from(RagDocument document) {
        return new RagDocumentDTO(document.getId(), document.getCategory(), document.getFilename(),
                document.getSizeBytes(), document.getSha256(), document.getVersion(), document.getPageCount(),
                document.getChunkCount(), document.getCreatedAt(), document.getUpdatedAt());
    }
}
