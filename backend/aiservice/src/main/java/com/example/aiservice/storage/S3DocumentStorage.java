package com.example.aiservice.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.CreateBucketRequest;
import software.amazon.awssdk.services.s3.model.HeadBucketRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

@Service
public class S3DocumentStorage {

    private final S3Client client;
    private final String bucket;

    public S3DocumentStorage(S3Client client, @Value("${app.storage.s3.bucket}") String bucket) {
        this.client = client;
        this.bucket = bucket;
    }

    public void put(String key, byte[] content) {
        ensureBucket();
        client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucket)
                        .key(key)
                        .contentType(MediaType.APPLICATION_PDF_VALUE)
                        .build(),
                RequestBody.fromBytes(content));
    }

    private void ensureBucket() {
        try {
            client.headBucket(HeadBucketRequest.builder().bucket(bucket).build());
        }
        catch (S3Exception exception) {
            if (exception.statusCode() != 404) {
                throw exception;
            }
            client.createBucket(CreateBucketRequest.builder().bucket(bucket).build());
        }
    }
}
