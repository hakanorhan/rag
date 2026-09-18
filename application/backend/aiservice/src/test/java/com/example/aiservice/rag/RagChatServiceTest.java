package com.example.aiservice.rag;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
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

import com.example.aiservice.rag.ChatController.ChatRequest;
import org.springframework.jdbc.core.JdbcTemplate;

class RagChatServiceTest {

    @Test
    void shouldReturnAnswerAndRetrievedSource() {
        var chatModel = mock(ChatModel.class);
        var vectorStore = mock(VectorStore.class);
        var jdbcTemplate = mock(JdbcTemplate.class);
        var interactionRepository = mock(RagInteractionRepository.class);

        UUID conversationId = UUID.randomUUID();
        UUID documentId = UUID.randomUUID();

        String question = "Wie hoch ist die Selbstbeteiligung?";
        String answer = "Die Selbstbeteiligung beträgt 1.000 €.";

        var document = Document.builder()
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

        when(chatModel.call(any(Prompt.class)))
                .thenReturn(new ChatResponse(
                        List.of(new Generation(new AssistantMessage(answer)))
                ));
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

        var service = new RagChatService(
                chatClient,
                jdbcTemplate,
                interactionRepository,
                "test-model"
        );

        var result = service.chat(
                new ChatRequest(question, conversationId)
        );

        assertThat(result.answer()).isEqualTo(answer);

        assertThat(result.sources())
                .singleElement()
                .satisfies(source -> {
                    assertThat(source.documentId()).isEqualTo(documentId);
                    assertThat(source.fileName()).isEqualTo("AGB.pdf");
                    assertThat(source.page()).isEqualTo(7);
                    assertThat(source.chunkId()).isEqualTo("chunk-42");
                    assertThat(source.similarityScore()).isEqualTo(0.94);
                });

        verify(interactionRepository)
                .save(any(RagInteraction.class));
    }
}
