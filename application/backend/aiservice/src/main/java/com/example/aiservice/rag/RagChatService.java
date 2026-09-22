package com.example.aiservice.rag;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import org.springframework.ai.chat.client.ChatClientResponse;
import org.springframework.ai.chat.client.advisor.vectorstore.QuestionAnswerAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.document.Document;
import org.springframework.ai.reader.pdf.PagePdfDocumentReader;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.stereotype.Service;

import com.example.aiservice.rag.ChatController.RagSource;
import com.example.aiservice.AiChatClientService;
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

    public ChatController.ChatResponse chat(ChatController.ChatRequest request) {
        UUID requestedConversationId = request.conversationId();
        boolean newConversation = requestedConversationId == null
                || !interactionRepository.existsByConversationId(requestedConversationId);
        UUID conversationId = newConversation
            ? Objects.requireNonNull(
                    jdbcTemplate.queryForObject("SELECT uuidv7()", UUID.class),
                    "Failed to generate conversation ID"
            )
            : Objects.requireNonNull(requestedConversationId);

        long start = System.nanoTime();
        ChatClientResponse response = aiChatClientService.ragChatClient().prompt()
                .user(request.message())
                .advisors(advisor -> advisor.param(
                        ChatMemory.CONVERSATION_ID,
                        conversationId.toString()
                ))
                .call()
                .chatClientResponse();

        String answer = response.chatResponse().getResult().getOutput().getText();
        Object retrieved = response.context().get(QuestionAnswerAdvisor.RETRIEVED_DOCUMENTS);
        List<RagSource> sources = retrieved instanceof List<?> documents
                ? documents.stream()
                        .filter(Document.class::isInstance)
                        .map(Document.class::cast)
                        .map(RagChatService::source)
                        .distinct()
                        .toList()
                : List.of();

        RagInteraction interaction = new RagInteraction(
                conversationId,
                request.message(),
                answer,
                aiChatClientService.configuration().model(),
                TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - start),
                Instant.now()
        );
        sources.forEach(source -> interaction.addSource(
                source.documentId(),
                source.fileName(),
                source.page(),
                source.chunkId(),
                source.similarityScore()
        ));
        interactionRepository.save(interaction);

        return new ChatController.ChatResponse(conversationId, answer, sources);
    }

    public Flux<ServerSentEvent<String>> stream(ChatController.ChatRequest request) {
        UUID requestedConversationId = request.conversationId();
        boolean newConversation = requestedConversationId == null
                || !interactionRepository.existsByConversationId(requestedConversationId);
        UUID conversationId = newConversation
                ? Objects.requireNonNull(
                        jdbcTemplate.queryForObject("SELECT uuidv7()", UUID.class),
                        "Failed to generate conversation ID"
                )
                : Objects.requireNonNull(requestedConversationId);

        Set<String> emittedSources = new HashSet<>();
        return aiChatClientService.ragChatClient().prompt()
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
                            events.add(ServerSentEvent.<String>builder()
                                    .event("message")
                                    .data(chunk)
                                    .build());
                        }
                    }
                    Object retrieved = response.context().get(QuestionAnswerAdvisor.RETRIEVED_DOCUMENTS);
                    if (retrieved instanceof List<?> documents) {
                        documents.stream()
                                .filter(Document.class::isInstance)
                                .map(Document.class::cast)
                                .map(document -> pdfLink(source(document).fileName()))
                                .filter(Objects::nonNull)
                                .filter(emittedSources::add)
                                .map(link -> ServerSentEvent.<String>builder()
                                        .event("source")
                                        .data(link)
                                        .build())
                                .forEach(events::add);
                    }
                    return Flux.fromIterable(events);
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

    private static String pdfLink(String fileName) {
        if (fileName == null) return null;
        return switch (fileName.toLowerCase(java.util.Locale.ROOT)) {
            case "agb.pdf", "agb_autovermietung.pdf" -> "/documents/AGB_Autovermietung.pdf";
            case "datenschutz.pdf" -> "/documents/Datenschutz.pdf";
            case "mietvertrag.pdf" -> "/documents/Mietvertrag.pdf";
            case "versicherung.pdf" -> "/documents/Versicherung.pdf";
            default -> null;
        };
    }
}
