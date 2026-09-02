package com.example.aiservice.rag;

import org.springframework.ai.reader.tika.TikaDocumentReader;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

@Service
public class DocumentIngestion implements ApplicationRunner {

    @Value("classpath:/documents/AGB_Autovermietung.pdf")
    private Resource resource;

    private final VectorStore vectorStore;

    public DocumentIngestion(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    public void createRAG() {
        var reader = new TikaDocumentReader(resource);
        var splitter = TokenTextSplitter.builder()
                .withChunkSize(400)
                .build();

        vectorStore.write(splitter.split(reader.read()));
    }

    @Override
    public void run(ApplicationArguments args) {
        createRAG();
    }
}
