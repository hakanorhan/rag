package com.example.aiservice.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
public class S3DocumentStorage {

    private final S3Client client;
    private final String bucket;

    public S3DocumentStorage(S3Client client, @Value("${app.storage.s3.bucket}") String bucket) {
        this.client = client;
        this.bucket = bucket;
    }

    public void put(String key, byte[] content) {
        client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucket)
                        .key(key)
                        .contentType(MediaType.APPLICATION_PDF_VALUE)
                        .build(),
                RequestBody.fromBytes(content));
    }

    public byte[] get(String key) {
        return client.getObjectAsBytes(GetObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build()).asByteArray();
    }
}
