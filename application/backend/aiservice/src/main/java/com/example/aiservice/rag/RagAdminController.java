package com.example.aiservice.rag;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/rag/edit")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class RagAdminController {
    private final DocumentIngestion ingestion;

    @GetMapping
    public List<RagDocumentDTO> list() {
        return ingestion.list();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public RagDocumentDTO upload(@RequestParam RagCategory category, @RequestPart("file") MultipartFile file) {
        return ingestion.upload(category, file);
    }

    @PutMapping(path = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public RagDocumentDTO replace(@PathVariable UUID id, @RequestParam @Positive int version,
            @RequestParam RagCategory category, @RequestPart("file") MultipartFile file) {
        return ingestion.replace(id, version, category, file);
    }
}
