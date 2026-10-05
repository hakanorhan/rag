package com.example.aiservice.rag;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.springframework.ai.chat.client.ChatClientResponse;
import org.springframework.ai.document.Document;
import org.springframework.ai.rag.advisor.RetrievalAugmentationAdvisor;
import org.springframework.ai.reader.pdf.PagePdfDocumentReader;
import org.springframework.http.codec.ServerSentEvent;

import com.example.aiservice.rag.ChatController.RagSource;

final class RagChatResponseEvents {

    private final String locale;
    private final Set<String> emittedSources = new HashSet<>();
    private final Set<String> storedChunks = new HashSet<>();
    private final List<RagSource> sources = new ArrayList<>();
    private final StringBuilder answer = new StringBuilder();

    RagChatResponseEvents(String locale) {
        this.locale = locale;
    }

    List<ServerSentEvent<Map<String, String>>> accept(ChatClientResponse response) {
        List<ServerSentEvent<Map<String, String>>> events = new ArrayList<>();
        addAnswerEvent(response, events);
        addSourceEvents(response, events);
        return events;
    }

    String answer() {
        return answer.toString();
    }

    List<RagSource> sources() {
        return List.copyOf(sources);
    }

    private void addAnswerEvent(
            ChatClientResponse response, List<ServerSentEvent<Map<String, String>>> events) {
        if (response.chatResponse() == null
                || response.chatResponse().getResult() == null
                || response.chatResponse().getResult().getOutput() == null) {
            return;
        }
        String chunk = response.chatResponse().getResult().getOutput().getText();
        if (chunk == null || chunk.isEmpty()) {
            return;
        }

        answer.append(chunk);
        events.add(ServerSentEvent.<Map<String, String>>builder()
                .event("message")
                .data(Map.of("text", chunk))
                .build());
    }

    private void addSourceEvents(
            ChatClientResponse response, List<ServerSentEvent<Map<String, String>>> events) {
        Object retrieved = response.context().get(RetrievalAugmentationAdvisor.DOCUMENT_CONTEXT);
        if (!(retrieved instanceof List<?> documents)) {
            return;
        }

        documents.stream()
                .filter(Document.class::isInstance)
                .map(Document.class::cast)
                .map(RagChatResponseEvents::source)
                .forEach(source -> {
                    if (storedChunks.add(source.chunkId())) {
                        sources.add(source);
                    }
                    String link = pdfLink(source.fileName());
                    if (link != null && emittedSources.add(link)) {
                        events.add(ServerSentEvent.<Map<String, String>>builder()
                                .event("source")
                                .data(Map.of("url", link))
                                .build());
                    }
                });
    }

    private static RagSource source(Document document) {
        Map<String, Object> metadata = document.getMetadata();
        return new RagSource(
                UUID.fromString(metadata.get("document_id").toString()),
                metadata.get(PagePdfDocumentReader.METADATA_FILE_NAME).toString(),
                ((Number) metadata.get(PagePdfDocumentReader.METADATA_START_PAGE_NUMBER)).intValue(),
                metadata.get("chunk_id").toString(),
                document.getScore()
        );
    }

    private String pdfLink(String fileName) {
        if (fileName == null) {
            return null;
        }
        String language = "de".equals(locale) ? "de" : "en";
        return switch (fileName.toLowerCase(Locale.ROOT)) {
            case "agb-2026-01-de.pdf", "agb-2026-01-en.pdf" ->
                    "/documents/" + language + "/agb-2026-01-" + language + ".pdf";
            case "datenschutz-2026-01-de.pdf", "datenschutz-2026-01-en.pdf" ->
                    "/documents/" + language + "/datenschutz-2026-01-" + language + ".pdf";
            case "versicherung-2026-01-de.pdf", "versicherung-2026-01-en.pdf" ->
                    "/documents/" + language + "/versicherung-2026-01-" + language + ".pdf";
            default -> null;
        };
    }
}
