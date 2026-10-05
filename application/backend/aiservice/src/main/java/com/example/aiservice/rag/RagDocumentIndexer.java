package com.example.aiservice.rag;

import java.time.Instant;
import java.util.List;

import org.springframework.ai.document.Document;
import org.springframework.ai.reader.pdf.PagePdfDocumentReader;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.filter.FilterExpressionBuilder;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

@Component
public class RagDocumentIndexer {

    private final VectorStore vectorStore;

    public RagDocumentIndexer(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    public void index(RagDocument document, RagCategory category, ParsedPdf pdf, Instant updatedAt,
            boolean replacing) {
        String documentId = document.getId().toString();
        int version = document.getVersion();
        List<Document> chunks = pdf.chunks().stream()
                .map(chunk -> chunk.mutate()
                        .metadata(PagePdfDocumentReader.METADATA_FILE_NAME, pdf.filename())
                        .metadata("document_id", documentId)
                        .metadata("chunk_id", chunk.getId())
                        .metadata("category", category.name())
                        .metadata("filename", pdf.filename())
                        .metadata("content_type", MediaType.APPLICATION_PDF_VALUE)
                        .metadata("sha256", pdf.sha256())
                        .metadata("version", version)
                        .metadata("updated_at", updatedAt.toString())
                        .build())
                .toList();

        // PgVectorStore uses the same DataSource and joins this JPA transaction.
        if (replacing) {
            vectorStore.delete(new FilterExpressionBuilder().eq("document_id", documentId).build());
        }
        vectorStore.add(chunks);
    }
}
