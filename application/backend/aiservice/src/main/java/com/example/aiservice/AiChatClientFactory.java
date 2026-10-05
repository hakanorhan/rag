package com.example.aiservice;

import java.util.Map;

import org.springframework.ai.anthropic.AnthropicChatModel;
import org.springframework.ai.anthropic.AnthropicChatOptions;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.rag.advisor.RetrievalAugmentationAdvisor;
import org.springframework.ai.rag.preretrieval.query.transformation.CompressionQueryTransformer;
import org.springframework.ai.rag.retrieval.search.VectorStoreDocumentRetriever;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Component;

@Component
public class AiChatClientFactory {

    private static final String RAG_SYSTEM = """
            Sie agieren als juristisch geschulter Assistent für die Auswertung
            von Mietwagen-AGB.

            Sie geben ausschließlich den Inhalt der bereitgestellten Dokumente wieder
            und erteilen keine Rechtsberatung.

            Nutzen Sie ausschließlich den bereitgestellten Dokumentenkontext.
            Antworten Sie kurz, präzise und ausschließlich auf {language}.
            Sprechen Sie Nutzer in deutschen Antworten mit „Sie“ an.
            Ergänzen Sie kein externes juristisches Wissen.
            Erfinden Sie keine Vertragsbedingungen, Ausnahmen, Zahlen oder Fristen.

            Wenn eine Information nicht im Kontext enthalten ist, sagen Sie:
            "Diese Information ist im bereitgestellten Kontext nicht enthalten."
            """;

    private static final String CAR_SEARCH_SYSTEM = """
            Sie wandeln eine deutsch- oder englischsprachige Mietwagensuche
            ausschließlich in strukturierte Suchparameter um.

            Erlaubte Felder:
            - carCategory: Fahrzeugkategorie, zum Beispiel Premium Cabrio
            - carType: vorhandene Fahrzeugklasse. Verwenden Sie ausschließlich einen dieser
              exakten Werte: Economy, Comfort, Premium, Sports Car, Electric Car.
              Übersetzen Sie "Sportwagen" und "sports car" immer zu "Sports Car".
            - location: Abholort
            - returnLocation: Rückgabeort, falls er ausdrücklich genannt wird
            - pickupAt: Abholzeit als ISO-8601-Zeitpunkt mit Zeitzonen-Offset
            - returnAt: Rückgabezeit als ISO-8601-Zeitpunkt mit Zeitzonen-Offset

            Lassen Sie nicht genannte oder nicht eindeutig ableitbare Felder aus der
            strukturierten Ausgabe weg. Geben Sie für solche Felder nicht null aus.
            Erfinden Sie keine Werte. Angaben zu Sitzen, Personen oder Einsatzzweck
            werden ignoriert, weil diese Filter nicht im Datenmodell vorhanden sind.
            Bei einem Datum ohne Uhrzeit verwenden Sie 10:30 Uhr in Europe/Berlin.
            """;

    private final VectorStore vectorStore;

    public AiChatClientFactory(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    public Clients create(AiProvider provider, String baseUrl, String model, String apiKey) {
        ChatModel chatModel = createChatModel(provider, baseUrl, model, apiKey);
        return new Clients(
                chatModel,
                buildClient(chatModel, RAG_SYSTEM, true),
                buildClient(chatModel, CAR_SEARCH_SYSTEM, false)
        );
    }

    private ChatModel createChatModel(AiProvider provider, String baseUrl, String model, String apiKey) {
        return switch (provider) {
            case OPENAI, GROQ, DEEPSEEK -> buildOpenAiCompatibleChatModel(provider, baseUrl, model, apiKey);
            case ANTHROPIC -> AnthropicChatModel.builder()
                    .options(AnthropicChatOptions.builder()
                            .apiKey(apiKey)
                            .model(model)
                            .build())
                    .build();
        };
    }

    private ChatClient buildClient(ChatModel chatModel, String system, boolean rag) {
        ChatClient.Builder builder = ChatClient.builder(chatModel).defaultSystem(system);
        if (rag) {
            builder.defaultAdvisors(
                    RetrievalAugmentationAdvisor.builder()
                            .queryTransformers(CompressionQueryTransformer.builder()
                                    .chatClientBuilder(ChatClient.builder(chatModel))
                                    .build())
                            .documentRetriever(VectorStoreDocumentRetriever.builder()
                                    .vectorStore(vectorStore)
                                    .topK(4)
                                    .similarityThreshold(0.5)
                                    .build())
                            .build()
            );
        }
        return builder.build();
    }

    private OpenAiChatModel buildOpenAiCompatibleChatModel(
            AiProvider provider, String baseUrl, String model, String apiKey) {
        OpenAiChatOptions.Builder options = OpenAiChatOptions.builder()
                .baseUrl(baseUrl)
                .apiKey(apiKey)
                .model(model);
        if (provider == AiProvider.GROQ) {
            options.extraBody(Map.of("include_reasoning", false));
        }
        return OpenAiChatModel.builder().options(options.build()).build();
    }

    public record Clients(ChatModel model, ChatClient rag, ChatClient carSearch) {
    }
}
