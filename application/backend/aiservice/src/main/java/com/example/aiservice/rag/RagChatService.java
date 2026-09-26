package com.example.aiservice.rag;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.document.Document;
import org.springframework.ai.rag.advisor.RetrievalAugmentationAdvisor;
import org.springframework.ai.reader.pdf.PagePdfDocumentReader;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.example.aiservice.AiChatClientService;
import com.example.aiservice.rag.ChatController.RagSource;

import reactor.core.publisher.Flux;

@Service
public class RagChatService {

    private final AiChatClientService aiChatClientService;
    private final JdbcTemplate jdbcTemplate;
    private final RagInteractionRepository interactionRepository;

    public RagChatService(
            AiChatClientService aiChatClientService,
            JdbcTemplate jdbcTemplate,
            RagInteractionRepository interactionRepository
    ) {
        this.aiChatClientService = aiChatClientService;
        this.jdbcTemplate = jdbcTemplate;
        this.interactionRepository = interactionRepository;
    }

    public ChatStream stream(ChatController.ChatRequest request) {
        Instant startedAt = Instant.now();
        long startedAtNanos = System.nanoTime();
        UUID requestedConversationId = request.conversationId();
        boolean newConversation = requestedConversationId == null;
        UUID conversationId = newConversation
                ? Objects.requireNonNull(
                        jdbcTemplate.queryForObject("SELECT uuidv7()", UUID.class),
                        "Failed to generate conversation ID"
                )
                : Objects.requireNonNull(requestedConversationId);

        Set<String> emittedSources = new HashSet<>();
        Set<String> storedChunks = new HashSet<>();
        List<RagSource> interactionSources = new ArrayList<>();
        StringBuilder assistantAnswer = new StringBuilder();
        String model = aiChatClientService.configuration().model();
        Flux<ServerSentEvent<String>> responseEvents = aiChatClientService.ragChatClient().prompt()
                .system(system -> system.param("language", responseLanguage(request.locale())))
                .user(request.message())
                .advisors(advisor -> advisor.param(
                ChatMemory.CONVERSATION_ID,
                conversationId.toString()
        ))
                .stream()
                .chatClientResponse()
                .concatMap(response -> {
                    List<ServerSentEvent<String>> events = new ArrayList<>();
                    if (response.chatResponse() != null
                            && response.chatResponse().getResult() != null
                            && response.chatResponse().getResult().getOutput() != null) {
                        String chunk = response.chatResponse().getResult().getOutput().getText();
                        if (chunk != null && !chunk.isEmpty()) {
                            assistantAnswer.append(chunk);
                            events.add(ServerSentEvent.<String>builder()
                                    .event("message")
                                    .data(chunk)
                                    .build());
                        }
                    }
                    Object retrieved = response.context().get(RetrievalAugmentationAdvisor.DOCUMENT_CONTEXT);
                    if (retrieved instanceof List<?> documents) {
                        documents.stream()
                                .filter(Document.class::isInstance)
                                .map(Document.class::cast)
                                .map(RagChatService::source)
                                .forEach(source -> {
                                    if (storedChunks.add(source.chunkId())) {
                                        interactionSources.add(source);
                                    }
                                    String link = pdfLink(source.fileName(), request.locale());
                                    if (link != null && emittedSources.add(link)) {
                                        events.add(ServerSentEvent.<String>builder()
                                                .event("source")
                                                .data(link)
                                                .build());
                                    }
                                });
                    }
                    return Flux.fromIterable(events);
                })
                .doOnComplete(() -> saveInteraction(
                conversationId,
                request.message(),
                assistantAnswer.toString(),
                model,
                (System.nanoTime() - startedAtNanos) / 1_000_000,
                startedAt,
                interactionSources
        ));

        return new ChatStream(conversationId, responseEvents);
    }

    private void saveInteraction(UUID conversationId, String userMessage, String assistantAnswer,
            String model, long responseTime, Instant createdAt, List<RagSource> sources) {
        RagInteraction interaction = new RagInteraction(
                conversationId, userMessage, assistantAnswer, model, responseTime, createdAt
        );
        sources.forEach(source -> interaction.addSource(
                source.documentId(), source.fileName(), source.page(), source.chunkId(), source.similarityScore()
        ));
        interactionRepository.save(interaction);
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

    private static String responseLanguage(String locale) {
        return "en".equals(locale) ? "Englisch" : "Deutsch";
    }

    private static String pdfLink(String fileName, String locale) {
        if (fileName == null) {
            return null;
        }
        String language = "de".equals(locale) ? "de" : "en";
        return switch (fileName.toLowerCase(java.util.Locale.ROOT)) {
            case "agb-2026-01-de.pdf", "agb-2026-01-en.pdf" ->
                "/documents/" + language + "/agb-2026-01-" + language + ".pdf";
            case "datenschutz-2026-01-de.pdf", "datenschutz-2026-01-en.pdf" ->
                "/documents/" + language + "/datenschutz-2026-01-" + language + ".pdf";
            case "versicherung-2026-01-de.pdf", "versicherung-2026-01-en.pdf" ->
                "/documents/" + language + "/versicherung-2026-01-" + language + ".pdf";
            default ->
                null;
        };
    }

    public record ChatStream(UUID conversationId, Flux<ServerSentEvent<String>> events) {

    }
}
