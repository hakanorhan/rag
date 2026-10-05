package com.example.aiservice.rag;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "rag_interaction")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RagInteraction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_message", nullable = false, columnDefinition = "TEXT")
    private String userMessage;

    @Column(name = "assistant_answer", nullable = false, columnDefinition = "TEXT")
    private String assistantAnswer;

    @Column(nullable = false)
    private String model;

    @Column(name = "response_time", nullable = false)
    private long responseTime;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @OneToMany(mappedBy = "interaction", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RagInteractionSource> sources = new ArrayList<>();

    public RagInteraction(String userMessage, String assistantAnswer,
            String model, long responseTime, Instant createdAt) {
        this.userMessage = userMessage;
        this.assistantAnswer = assistantAnswer;
        this.model = model;
        this.responseTime = responseTime;
        this.createdAt = createdAt;
    }

    public void addSource(UUID documentId, String fileName, int pageNumber,
            String chunkId, Double similarityScore) {
        sources.add(new RagInteractionSource(
                this, documentId, fileName, pageNumber, chunkId, similarityScore));
    }
}
