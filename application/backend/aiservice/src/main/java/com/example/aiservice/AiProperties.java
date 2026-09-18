package com.example.aiservice;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.ai")
public record AiProperties(
        AiProvider provider,
        String baseUrl,
        String model,
        String apiKey
) {
}
