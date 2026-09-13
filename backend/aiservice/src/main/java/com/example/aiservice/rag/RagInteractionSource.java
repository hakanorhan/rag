package com.example.aiservice.rag;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "rag_interaction_source")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RagInteractionSource {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "interaction_id", nullable = false)
    private RagInteraction interaction;

    @Column(name = "document_id", nullable = false)
    private UUID documentId;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "page_number", nullable = false)
    private int pageNumber;

    @Column(name = "chunk_id", nullable = false)
    private String chunkId;

    @Column(name = "similarity_score")
    private Double similarityScore;

    RagInteractionSource(RagInteraction interaction, UUID documentId, String fileName,
            int pageNumber, String chunkId, Double similarityScore) {
        this.interaction = interaction;
        this.documentId = documentId;
        this.fileName = fileName;
        this.pageNumber = pageNumber;
        this.chunkId = chunkId;
        this.similarityScore = similarityScore;
    }
}
