package com.example.aiservice.rag;

import com.example.aiservice.TestcontainersConfiguration;
import org.junit.jupiter.api.Test;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.evaluation.RelevancyEvaluator;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.document.Document;
import org.springframework.ai.evaluation.EvaluationRequest;
import org.springframework.ai.evaluation.EvaluationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(properties = {
        "spring.ai.openai.api-key=",
        "spring.ai.ollama.init.pull-model-strategy=never"
})
@Import(TestcontainersConfiguration.class)
public class RagEvaluatorTest {

    @Autowired
    private ChatModel chatModel;

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
}
