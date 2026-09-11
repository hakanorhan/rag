package com.example.aiservice.rag;

import java.time.Instant;
import java.util.UUID;

import org.hibernate.annotations.Formula;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "rag_document")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RagDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private RagCategory category;

    @Column(nullable = false, length = 255)
    private String filename;

    @Getter(AccessLevel.NONE)
    @Column(name = "pdf_data", nullable = false)
    private byte[] pdfData;

    @Formula("octet_length(pdf_data)")
    private long sizeBytes;

    @Column(nullable = false, unique = true, length = 64)
    private String sha256;

    @Version
    @Column(nullable = false)
    private int version = 1;

    @Column(name = "page_count", nullable = false)
    private int pageCount;

    @Column(name = "chunk_count", nullable = false)
    private int chunkCount;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public RagDocument(RagCategory category, String filename, byte[] pdfData, String sha256,
            int pageCount, int chunkCount, Instant now) {
        this.createdAt = now;
        replace(category, filename, pdfData, sha256, pageCount, chunkCount, now);
    }

    public void replace(RagCategory category, String filename, byte[] pdfData, String sha256,
            int pageCount, int chunkCount, Instant now) {
        this.category = category;
        this.filename = filename;
        this.pdfData = pdfData.clone();
        this.sizeBytes = pdfData.length;
        this.sha256 = sha256;
        this.pageCount = pageCount;
        this.chunkCount = chunkCount;
        this.updatedAt = now;
    }

}
