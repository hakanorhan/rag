package com.example.aiservice.rag;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.aiservice.storage.S3DocumentStorage;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DocumentIngestion {

    private final RagDocumentRepository repository;
    private final S3DocumentStorage storage;
    private final PdfDocumentProcessor pdfProcessor;
    private final RagDocumentIndexer indexer;

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
        ParsedPdf pdf = pdfProcessor.process(file);
        if (previous != null && previous.getSha256().equals(pdf.sha256())) {
            return RagDocumentDTO.from(previous);
        }
        ensureUnique(pdf.sha256());
        String storageKey = "pdf/" + pdf.sha256() + ".pdf";

        storage.put(storageKey, pdf.bytes());
        Instant now = Instant.now();
        RagDocument document;
        if (previous == null) {
            document = new RagDocument(
                    category, pdf.filename(), pdf.sha256(), storageKey, pdf.bytes().length,
                    pdf.pageCount(), pdf.chunks().size(), now);
        }
        else {
            previous.replace(category, pdf.filename(), pdf.sha256(), storageKey, pdf.bytes().length,
                    pdf.pageCount(), pdf.chunks().size(), now);
            document = previous;
        }

        document = repository.saveAndFlush(document);
        indexer.index(document, category, pdf, now, previous != null);

        return RagDocumentDTO.from(document);
    }

    private void ensureUnique(String checksum) {
        if (repository.findFirstBySha256OrderByCreatedAtAsc(checksum).isPresent()) {
            throw new RagDocumentException(RagDocumentError.DOCUMENT_ALREADY_EXISTS);
        }
    }

}
