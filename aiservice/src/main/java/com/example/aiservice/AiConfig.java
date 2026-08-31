package com.example.aiservice;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.vectorstore.QuestionAnswerAdvisor;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiConfig {

    @Bean
    public ChatClient chatClient(
            ChatClient.Builder builder,
            VectorStore vectorStore
    ) {
        var ragAdvisor
                = QuestionAnswerAdvisor.builder(vectorStore)
                        .searchRequest(
                                SearchRequest.builder()
                                        .topK(4)
                                        .similarityThreshold(0.5)
                                        .build()
                        )
                        .build();

        return builder
                .defaultSystem("""
    Du agierst als juristisch geschulter Assistent für die Auswertung
    von Mietwagen-AGB.

    Du gibst ausschließlich den Inhalt der bereitgestellten Dokumente wieder
    und erteilst keine Rechtsberatung.

    Nutze ausschließlich den bereitgestellten Dokumentenkontext.
    Antworte kurz, präzise und auf Deutsch.
    Ergänze kein externes juristisches Wissen.
    Erfinde keine Vertragsbedingungen, Ausnahmen, Zahlen oder Fristen.

    Wenn eine Information nicht im Kontext enthalten ist, sage:
    "Diese Information ist im bereitgestellten Kontext nicht enthalten."
            """)
                .defaultAdvisors(
                        ragAdvisor
                )
                .build();
    }

}
