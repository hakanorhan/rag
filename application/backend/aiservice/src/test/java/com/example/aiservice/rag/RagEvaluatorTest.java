package com.example.aiservice.rag;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.ChatClientResponse;
import org.springframework.ai.chat.evaluation.RelevancyEvaluator;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.document.Document;
import org.springframework.ai.evaluation.EvaluationRequest;
import org.springframework.ai.evaluation.EvaluationResponse;
import org.springframework.ai.rag.advisor.RetrievalAugmentationAdvisor;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

import com.example.aiservice.AiChatClientService;
import com.example.aiservice.TestcontainersConfiguration;

@SpringBootTest(properties = {
    "spring.ai.model.chat=openai",
    "spring.ai.openai.api-key=${APP_AI_API_KEY}",
    "spring.ai.openai.base-url=${APP_AI_BASE_URL:https://api.openai.com}",
    "spring.ai.openai.chat.model=${APP_AI_MODEL:gpt-4o-mini}",
    "app.ai.provider=OPENAI",
    "app.ai.api-key=${APP_AI_API_KEY}",
    "app.ai.base-url=${APP_AI_BASE_URL:https://api.openai.com}",
    "app.ai.model=${APP_AI_MODEL:gpt-4o-mini}",
    "spring.ai.ollama.init.pull-model-strategy=never"
})
@Import(TestcontainersConfiguration.class)
@EnabledIfEnvironmentVariable(named = "APP_AI_API_KEY", matches = ".+")
public class RagEvaluatorTest {

    @Autowired
    private ChatModel chatModel;

    @Autowired
    private AiChatClientService aiChatClientService;

    @Autowired
    private VectorStore vectorStore;

    @Test
    void shouldEvaluateAnswerAsRelevant() {
        String question = "Wie hoch ist die Selbstbeteiligung?";

        List<Document> context = List.of(
                new Document("""
                       Das Schutzpaket Standard Plus reduziert die vertragliche Haftung der
                       mietenden Person für versicherte Fahrzeugschäden auf 1.000 EUR je Schadenfall.
                       Die Haftungsreduzierung greift nur für Schäden, die vom beschriebenen Schutz
                       erfasst sind und ordnungsgemäß gemeldet werden.
                       """
                )
        );

        String answer = "Die Selbstbeteiligung beträgt 1.000 €.";

        EvaluationRequest request = new EvaluationRequest(
                question,
                context,
                answer
        );

        RelevancyEvaluator evaluator = new RelevancyEvaluator(
                ChatClient.builder(chatModel)
        );

        EvaluationResponse result = evaluator.evaluate(request);

        assertThat(result.isPass()).isTrue();
    }

    @Test
    void shouldEvaluateConditionalAnswerAsRelevant() {
        String question = "Ein nicht autorisierter Zusatzfahrer verursacht einen versicherten Unfallschaden von 3.400 EUR. Beträgt die Selbstbeteiligung automatisch 1.000 EUR?";

        List<Document> context = List.of(
                new Document("""
                        Die Haftungsreduzierung kann entfallen oder gekürzt werden, wenn das Fahrzeug durch
                        nicht autorisierte Fahrer genutzt wurde. Der konkrete Betrag richtet sich nach dem
                        wirksam vereinbarten Vertrag und lässt sich aus diesem Dokument nicht bestimmen.

                        Bei einem versicherten Unfallschaden von 3.400 EUR beträgt die vertragliche Beteiligung
                        ohne Kürzungsgrund im Beispiel maximal 1.000 EUR.
                        """)
        );

        String answer = "Nein. Bei einem nicht autorisierten Fahrer kann die Haftungsreduzierung entfallen oder gekürzt werden. Der konkrete Betrag ist im Dokument nicht bestimmt.";

        EvaluationResponse result = new RelevancyEvaluator(
                ChatClient.builder(chatModel)
        ).evaluate(new EvaluationRequest(question, context, answer));

        assertThat(result.isPass()).isTrue();
    }

    @Test
    void shouldEvaluateGeneratedRagAnswerAgainstRetrievedContext() {
        String question = "Wie hoch ist die Selbstbeteiligung im Schutzpaket Standard Plus bei einem gedeckten Fahrzeugschaden?";
        Document document = Document.builder()
                .id(UUID.randomUUID().toString())
                .text("Das Schutzpaket Standard Plus reduziert die vertragliche Haftung für gedeckte Fahrzeugschäden auf 1.000 EUR je Schadenfall.")
                .build();

        vectorStore.add(List.of(document));
        try {
            ChatClientResponse response = aiChatClientService.ragChatClient().prompt()
                    .system(system -> system.param("language", "Deutsch"))
                    .user(question)
                    .advisors(advisor -> advisor.param(ChatMemory.CONVERSATION_ID, UUID.randomUUID().toString()))
                    .call()
                    .chatClientResponse();

            assertThat(response.chatResponse()).isNotNull();
            String answer = response.chatResponse().getResult().getOutput().getText();

            Object retrieved = response.context().get(RetrievalAugmentationAdvisor.DOCUMENT_CONTEXT);
            assertThat(retrieved).isInstanceOf(List.class);
            List<Document> context = ((List<?>) retrieved).stream().map(Document.class::cast).toList();
            assertThat(context).extracting(item -> item.getId()).contains(document.getId());

            EvaluationResponse evaluation = new RelevancyEvaluator(ChatClient.builder(chatModel))
                    .evaluate(new EvaluationRequest(question, context, answer));
            assertThat(evaluation.isPass()).isTrue();
        } finally {
            vectorStore.delete(List.of(document.getId()));
        }
    }
}
