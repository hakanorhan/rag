package com.example.aiservice.rag;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.ChatClientResponse;
import org.springframework.ai.chat.evaluation.RelevancyEvaluator;
import org.springframework.ai.document.Document;
import org.springframework.ai.evaluation.EvaluationRequest;
import org.springframework.ai.evaluation.EvaluationResponse;
import org.springframework.ai.rag.advisor.RetrievalAugmentationAdvisor;
import org.springframework.ai.reader.pdf.PagePdfDocumentReader;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

import com.example.aiservice.AiChatClientService;
import com.example.aiservice.TestcontainersConfiguration;

@SpringBootTest(properties = {
    "app.ai.provider=OPENAI",
    "app.ai.base-url=${APP_AI_BASE_URL:https://api.openai.com}",
    "app.ai.model=${APP_AI_MODEL:gpt-4o-mini}",
    "spring.ai.ollama.init.pull-model-strategy=never"
})
@Import(TestcontainersConfiguration.class)
@EnabledIfEnvironmentVariable(named = "APP_AI_API_KEY", matches = ".+")
public class RagEvaluatorTest {

    @Autowired
    private AiChatClientService aiChatClientService;

    @Autowired
    private VectorStore vectorStore;

    @Test
    void shouldEvaluateGeneratedRagAnswerAgainstRetrievedContext() {
        String question = "Wie alt muss eine Person sein?";
        Document document = Document.builder()
                .id(UUID.randomUUID().toString())
                .text("Die fahrende Person muss grundsätzlich mindestens 21 Jahre alt sein und seit mindestens einem Jahr eine im Inland anerkannte Fahrerlaubnis besitzen. Für einzelne Fahrzeugklassen kann im Mietvertrag ein höheres Mindestalter oder eine längere Führerscheinbesitzdauer festgelegt sein.")
                .metadata(Map.of(
                        PagePdfDocumentReader.METADATA_FILE_NAME, "agb-2026-01-de.pdf",
                        PagePdfDocumentReader.METADATA_START_PAGE_NUMBER, 1
                ))
                .build();

        vectorStore.add(List.of(document));
        try {
            ChatClientResponse response = aiChatClientService.ragChatClient().prompt()
                    .system(system -> system.param("language", "Deutsch"))
                    .user(question)
                    .call()
                    .chatClientResponse();

            assertThat(response.chatResponse()).isNotNull();
            String answer = response.chatResponse().getResult().getOutput().getText();

            Object retrieved = response.context().get(RetrievalAugmentationAdvisor.DOCUMENT_CONTEXT);
            assertThat(retrieved).isInstanceOf(List.class);
            List<Document> context = ((List<?>) retrieved).stream().map(Document.class::cast).toList();
            assertThat(context).extracting(item -> item.getId()).contains(document.getId());

            EvaluationResponse evaluation = new RelevancyEvaluator(
                    ChatClient.builder(aiChatClientService.chatModel()))
                    .evaluate(new EvaluationRequest(question, context, answer));
            assertThat(evaluation.isPass()).isTrue();
        } finally {
            vectorStore.delete(List.of(document.getId()));
        }
    }
}
