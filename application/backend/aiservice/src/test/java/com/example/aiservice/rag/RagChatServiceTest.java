package com.example.aiservice.rag;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.vectorstore.QuestionAnswerAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.model.Generation;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.document.Document;
import org.springframework.ai.reader.pdf.PagePdfDocumentReader;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.http.codec.ServerSentEvent;

import com.example.aiservice.rag.ChatController.ChatRequest;
import com.example.aiservice.AiChatClientService;
import org.springframework.jdbc.core.JdbcTemplate;

class RagChatServiceTest {

    @Test
    void shouldStreamAnswerAndLocalizedSource() {
        ChatModel chatModel = mock(ChatModel.class);
        VectorStore vectorStore = mock(VectorStore.class);
        JdbcTemplate jdbcTemplate = mock(JdbcTemplate.class);
        RagInteractionRepository interactionRepository = mock(RagInteractionRepository.class);
        AiChatClientService aiChatClientService = mock(AiChatClientService.class);

        UUID conversationId = UUID.randomUUID();
        UUID documentId = UUID.randomUUID();

        String question = "How much is the deductible?";
        String answer = "The deductible is €1,000.";

        Document document = Document.builder()
                .text(answer)
                .metadata(Map.of(
                        "document_id", documentId.toString(),
                        PagePdfDocumentReader.METADATA_FILE_NAME, "AGB.pdf",
                        PagePdfDocumentReader.METADATA_START_PAGE_NUMBER, 7,
                        "chunk_id", "chunk-42"
                ))
                .score(0.94)
                .build();

        when(vectorStore.similaritySearch(any(SearchRequest.class)))
                .thenReturn(List.of(document));

        when(chatModel.stream(any(Prompt.class)))
                .thenReturn(reactor.core.publisher.Flux.just(new ChatResponse(
                        List.of(new Generation(new AssistantMessage(answer)))
                )));
        when(chatModel.getOptions()).thenReturn(ChatOptions.builder().build());

        when(interactionRepository.existsByConversationId(conversationId))
                .thenReturn(true);

        ChatMemory chatMemory =
                MessageWindowChatMemory.builder().build();

        ChatClient chatClient = ChatClient.builder(chatModel)
                .defaultAdvisors(
                        MessageChatMemoryAdvisor.builder(chatMemory).build(),
                        QuestionAnswerAdvisor.builder(vectorStore).build()
                )
                .build();

        when(aiChatClientService.ragChatClient()).thenReturn(chatClient);
        RagChatService service = new RagChatService(
                aiChatClientService,
                jdbcTemplate,
                interactionRepository
        );

        List<ServerSentEvent<String>> result = service.stream(
                new ChatRequest(question, conversationId, "en")
        ).collectList().block();

        assertThat(result).isNotNull();
        assertThat(result).anySatisfy(event -> {
            assertThat(event.event()).isEqualTo("message");
            assertThat(event.data()).isEqualTo(answer);
        });
        assertThat(result).anySatisfy(event -> {
            assertThat(event.event()).isEqualTo("source");
            assertThat(event.data()).isEqualTo("/documents/en/agb-2026-01-en.pdf");
        });
    }
}
