package com.example.aiservice.rag;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.ai.document.Document;
import org.springframework.ai.reader.pdf.PagePdfDocumentReader;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.filter.FilterExpressionBuilder;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DocumentIngestion {

    private static final TokenTextSplitter SPLITTER = TokenTextSplitter.builder().withChunkSize(400).build();

    private final VectorStore vectorStore;
    private final RagDocumentRepository repository;

    @Transactional(readOnly = true)
    public List<RagDocumentDTO> list() {
        return repository.findAllProjectedByOrderByUpdatedAtDescIdAsc();
    }

    @Transactional
    public RagDocumentDTO upload(RagCategory category, MultipartFile file) {
        return processDocument(null, category, file);
    }

    @Transactional
    public RagDocumentDTO replace(UUID id, int expectedVersion, RagCategory category, MultipartFile file) {
        RagDocument previous = repository.findByIdForUpdate(id)
                .orElseThrow(() -> new RagDocumentException(RagDocumentError.DOCUMENT_NOT_FOUND));

        if (previous.getVersion() != expectedVersion) {
            throw new RagDocumentException(RagDocumentError.VERSION_CONFLICT);
        }

        return processDocument(previous, category, file);
    }

    private RagDocumentDTO processDocument(RagDocument previous, RagCategory category, MultipartFile file) {
        PdfFile pdf = readFile(file);
        if (previous != null && previous.getSha256().equals(pdf.sha256())) {
            return RagDocumentDTO.from(previous);
        }
        ensureUnique(pdf.sha256());

        List<Document> pages = readPdf(pdf.bytes());
        List<Document> chunks = prepareChunks(pages);
        Instant now = Instant.now();
        RagDocument document = createOrReplaceDocument(previous, category, pdf, pages.size(), chunks.size(), now);

        document = repository.saveAndFlush(document);
        index(document, category, pdf, chunks, now, previous != null);

        return RagDocumentDTO.from(document);
    }

    private PdfFile readFile(MultipartFile file) {
        String filename = validateFilename(file);
        byte[] bytes = readBytes(file);
        return new PdfFile(filename, bytes, DigestUtils.sha256Hex(bytes));
    }

    private byte[] readBytes(MultipartFile file) {
        try {
            return file.getBytes();
        }
        catch (IOException exception) {
            throw new RagDocumentException(RagDocumentError.INVALID_PDF, exception);
        }
    }

    private List<Document> readPdf(byte[] bytes) {
        try {
            return new PagePdfDocumentReader(new ByteArrayResource(bytes)).read();
        }
        catch (RuntimeException exception) {
            throw new RagDocumentException(RagDocumentError.INVALID_PDF, exception);
        }
    }

    private void ensureUnique(String checksum) {
        if (repository.findFirstBySha256OrderByCreatedAtAsc(checksum).isPresent()) {
            throw new RagDocumentException(RagDocumentError.DOCUMENT_ALREADY_EXISTS);
        }
    }

    private List<Document> prepareChunks(List<Document> pages) {
        return SPLITTER.split(pages);
    }

    private RagDocument createOrReplaceDocument(RagDocument previous, RagCategory category, PdfFile pdf,
            int pageCount, int chunkCount, Instant now) {
        if (previous == null) {
            return new RagDocument(category, pdf.filename(), pdf.bytes(), pdf.sha256(), pageCount, chunkCount, now);
        }

        previous.replace(category, pdf.filename(), pdf.bytes(), pdf.sha256(), pageCount, chunkCount, now);
        return previous;
    }

    private void index(RagDocument document, RagCategory category, PdfFile pdf, List<Document> chunks, Instant now,
            boolean replacing) {
        String documentId = document.getId().toString();
        int version = document.getVersion();
        chunks = chunks.stream()
                .map(chunk -> chunk.mutate()
                        .metadata(PagePdfDocumentReader.METADATA_FILE_NAME, pdf.filename())
                        .metadata("document_id", documentId)
                        .metadata("category", category.name())
                        .metadata("filename", pdf.filename())
                        .metadata("content_type", MediaType.APPLICATION_PDF_VALUE)
                        .metadata("sha256", pdf.sha256())
                        .metadata("version", version)
                        .metadata("updated_at", now.toString())
                        .build())
                .toList();

        // PgVectorStore uses the same DataSource and joins this JPA transaction.
        if (replacing) {
            vectorStore.delete(new FilterExpressionBuilder().eq("document_id", documentId).build());
        }
        vectorStore.add(chunks);
    }

    private String validateFilename(MultipartFile file) {
        String filename = StringUtils.getFilename(StringUtils.cleanPath(file.getOriginalFilename()));

        if (file.isEmpty()
                || !StringUtils.hasText(filename)
                || filename.length() > 255
                || !"pdf".equalsIgnoreCase(StringUtils.getFilenameExtension(filename))
                || filename.chars().anyMatch(Character::isISOControl)) {
            throw new RagDocumentException(RagDocumentError.INVALID_PDF);
        }

        return filename;
    }

    private record PdfFile(String filename, byte[] bytes, String sha256) {
    }
}
