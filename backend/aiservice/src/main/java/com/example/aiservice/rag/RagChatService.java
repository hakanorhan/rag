package com.example.aiservice.rag;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.vectorstore.QuestionAnswerAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.document.Document;
import org.springframework.ai.reader.pdf.PagePdfDocumentReader;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.example.aiservice.rag.ChatController.RagSource;

@Service
public class RagChatService {

    private final ChatClient chatClient;
    private final JdbcTemplate jdbcTemplate;
    private final RagInteractionRepository interactionRepository;
    private final String model;

    public RagChatService(
            ChatClient chatClient,
            JdbcTemplate jdbcTemplate,
            RagInteractionRepository interactionRepository,
            @Value("${spring.ai.openai.chat.model}") String model
    ) {
        this.chatClient = chatClient;
        this.jdbcTemplate = jdbcTemplate;
        this.interactionRepository = interactionRepository;
        this.model = model;
    }

    public ChatController.ChatResponse chat(ChatController.ChatRequest request) {
        UUID requestedConversationId = request.conversationId();
        boolean newConversation = requestedConversationId == null
                || !interactionRepository.existsByConversationId(requestedConversationId);
        UUID conversationId = newConversation
                ? jdbcTemplate.queryForObject("SELECT uuidv7()", UUID.class)
                : requestedConversationId;

        long start = System.nanoTime();
        var response = chatClient.prompt()
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
                model,
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

    private static RagSource source(Document document) {
        var metadata = document.getMetadata();
        return new RagSource(
                UUID.fromString(metadata.get("document_id").toString()),
                metadata.get(PagePdfDocumentReader.METADATA_FILE_NAME).toString(),
                ((Number) metadata.get(PagePdfDocumentReader.METADATA_START_PAGE_NUMBER)).intValue(),
                metadata.get("chunk_id").toString(),
                document.getScore()
        );
    }
}
