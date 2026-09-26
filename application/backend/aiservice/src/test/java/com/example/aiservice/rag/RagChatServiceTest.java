package com.example.aiservice.rag;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.model.Generation;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.document.Document;
import org.springframework.ai.rag.advisor.RetrievalAugmentationAdvisor;
import org.springframework.ai.rag.preretrieval.query.transformation.CompressionQueryTransformer;
import org.springframework.ai.rag.retrieval.search.VectorStoreDocumentRetriever;
import org.springframework.ai.reader.pdf.PagePdfDocumentReader;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.http.codec.ServerSentEvent;

import com.example.aiservice.rag.ChatController.ChatRequest;
import com.example.aiservice.AiChatClientService;
import com.example.aiservice.AiProvider;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.util.ReflectionTestUtils;

class RagChatServiceTest {

    @Test
    void shouldUseConversationContextForFollowUpQuestion() {
        ChatModel chatModel = mock(ChatModel.class);
        VectorStore vectorStore = mock(VectorStore.class);
        JdbcTemplate jdbcTemplate = mock(JdbcTemplate.class);
        RagInteractionRepository interactionRepository = mock(RagInteractionRepository.class);
        AiChatClientService aiChatClientService = mock(AiChatClientService.class);

        UUID conversationId = UUID.randomUUID();
        UUID anotherConversationId = UUID.randomUUID();
        UUID documentId = UUID.randomUUID();

        String question = "Kann ich mit 18 ein Auto mieten?";
        String followUpQuestion = "Dann darf auch ein 50-Jähriger fahren?";
        String standaloneQuestion = "Darf eine 50-jährige Person das Auto nach der Mindestalterregel fahren?";
        String answer = "Das Mindestalter beträgt 21 Jahre.";

        Document document = Document.builder()
                .text(answer)
                .metadata(Map.of(
                        "document_id", documentId.toString(),
                        PagePdfDocumentReader.METADATA_FILE_NAME, "agb-2026-01-de.pdf",
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
        when(chatModel.call(any(Prompt.class)))
                .thenReturn(new ChatResponse(
                        List.of(new Generation(new AssistantMessage(standaloneQuestion)))
                ));
        when(chatModel.getOptions()).thenReturn(ChatOptions.builder().build());

        when(jdbcTemplate.queryForObject("SELECT uuidv7()", UUID.class))
                .thenReturn(conversationId, anotherConversationId);

        ChatMemory chatMemory =
                MessageWindowChatMemory.builder().build();

        ChatClient chatClient = ChatClient.builder(chatModel)
                .defaultAdvisors(
                        MessageChatMemoryAdvisor.builder(chatMemory).build(),
                        RetrievalAugmentationAdvisor.builder()
                                .queryTransformers(CompressionQueryTransformer.builder()
                                        .chatClientBuilder(ChatClient.builder(chatModel))
                                        .build())
                                .documentRetriever(VectorStoreDocumentRetriever.builder()
                                        .vectorStore(vectorStore)
                                        .build())
                                .build()
                )
                .build();

        when(aiChatClientService.ragChatClient()).thenReturn(chatClient);
        when(aiChatClientService.configuration()).thenReturn(
                new AiChatClientService.AiConfigurationResponse(
                        AiProvider.OPENAI, "https://api.openai.com", "test-model", true
                )
        );
        RagChatService service = new RagChatService(
                aiChatClientService,
                jdbcTemplate,
                interactionRepository
        );

        RagChatService.ChatStream stream = service.stream(
                new ChatRequest(question, null, "de")
        );
        List<ServerSentEvent<String>> result = stream.events().collectList().block();
        service.stream(new ChatRequest(followUpQuestion, conversationId, "de"))
                .events()
                .collectList()
                .block();

        assertThat(result).isNotNull();
        assertThat(stream.conversationId()).isEqualTo(conversationId);
        assertThat(result).anySatisfy(event -> {
            assertThat(event.event()).isEqualTo("message");
            assertThat(event.data()).isEqualTo(answer);
        });
        assertThat(result).anySatisfy(event -> {
            assertThat(event.event()).isEqualTo("source");
            assertThat(event.data()).isEqualTo("/documents/de/agb-2026-01-de.pdf");
        });

        ArgumentCaptor<Prompt> compressionPrompts = ArgumentCaptor.forClass(Prompt.class);
        verify(chatModel, times(2)).call(compressionPrompts.capture());
        assertThat(compressionPrompts.getAllValues().get(1).getUserMessage().getText())
                .contains(question, answer, followUpQuestion);

        ArgumentCaptor<SearchRequest> searchRequests = ArgumentCaptor.forClass(SearchRequest.class);
        verify(vectorStore, times(2)).similaritySearch(searchRequests.capture());
        assertThat(searchRequests.getAllValues().get(1).getQuery()).isEqualTo(standaloneQuestion);

        ArgumentCaptor<RagInteraction> interactions = ArgumentCaptor.forClass(RagInteraction.class);
        verify(interactionRepository, times(2)).save(interactions.capture());
        RagInteraction firstInteraction = interactions.getAllValues().getFirst();
        assertThat(firstInteraction)
                .extracting("conversationId", "userMessage", "assistantAnswer", "model")
                .containsExactly(conversationId, question, answer, "test-model");
        assertThat((List<?>) ReflectionTestUtils.getField(firstInteraction, "sources")).hasSize(1);
    }
}
