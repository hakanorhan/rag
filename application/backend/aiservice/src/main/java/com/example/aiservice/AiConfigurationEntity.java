package com.example.aiservice;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ai_configuration")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AiConfigurationEntity {

    public static final int ID = 1;

    @Id
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private AiProvider provider;

    @Column(name = "base_url", nullable = false, length = 512)
    private String baseUrl;

    @Column(nullable = false, length = 255)
    private String model;

    @Column(name = "api_key", nullable = false, columnDefinition = "TEXT")
    private String apiKey;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public AiConfigurationEntity(AiProvider provider, String baseUrl, String model,
            String apiKey, Instant updatedAt) {
        this.id = ID;
        this.provider = provider;
        this.baseUrl = baseUrl;
        this.model = model;
        this.apiKey = apiKey;
        this.updatedAt = updatedAt;
    }
}
