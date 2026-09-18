package com.example.aiservice.storage;

import java.net.URI;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class S3StorageConfiguration {

    @Bean
    S3Client s3Client(
            @Value("${app.storage.s3.endpoint}") URI endpoint,
            @Value("${app.storage.s3.region}") String region) {
        return S3Client.builder()
                .endpointOverride(endpoint)
                .region(Region.of(region))
                .credentialsProvider(DefaultCredentialsProvider.builder().build())
                .forcePathStyle(true)
                .build();
    }
}
