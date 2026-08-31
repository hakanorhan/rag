package com.example.aiservice;

import java.util.List;

import org.springframework.ai.document.Document;
import org.springframework.ai.reader.tika.TikaDocumentReader;
import org.springframework.ai.transformer.splitter.TextSplitter;
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

        TikaDocumentReader reader =
                new TikaDocumentReader(resource);

        TextSplitter splitter =
                TokenTextSplitter.builder()
                        .withChunkSize(400)
                        .build();

        List<Document> documents =
                splitter.split(reader.read());

        documents.forEach(document -> {
            System.out.println("##################################");
            System.out.println("Score: " + document.getScore());
            System.out.println(document.getText());
            System.out.println(document.getMetadata());
            System.out.println("##################################");
        });

        vectorStore.add(documents);
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        createRAG();
    }
}