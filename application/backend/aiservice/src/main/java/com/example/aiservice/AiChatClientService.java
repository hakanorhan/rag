package com.example.aiservice;

import java.time.Instant;
import java.util.Optional;
import java.util.Map;

import org.springframework.ai.anthropic.AnthropicChatModel;
import org.springframework.ai.anthropic.AnthropicChatOptions;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.rag.advisor.RetrievalAugmentationAdvisor;
import org.springframework.ai.rag.preretrieval.query.transformation.CompressionQueryTransformer;
import org.springframework.ai.rag.retrieval.search.VectorStoreDocumentRetriever;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class AiChatClientService {

    private static final Map<AiProvider, String> DEFAULT_MODELS = Map.of(
            AiProvider.OPENAI, "gpt-4o-mini",
            AiProvider.GROQ, "openai/gpt-oss-120b",
            AiProvider.DEEPSEEK, "deepseek-chat",
            AiProvider.ANTHROPIC, "claude-sonnet-4-20250514"
    );

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
            Bei einem Datum ohne Uhrzeit verwenden Sie 10:00 Uhr in Europe/Berlin.
            """;

    private final ChatMemory chatMemory;
    private final VectorStore vectorStore;
    private final AiConfigurationRepository configurationRepository;
    private AiConfigurationState configuration;
    private ChatClient ragChatClient;
    private ChatClient carSearchChatClient;

    public AiChatClientService(AiProperties properties, ChatMemory chatMemory, VectorStore vectorStore,
            AiConfigurationRepository configurationRepository) {
        this.chatMemory = chatMemory;
        this.vectorStore = vectorStore;
        this.configurationRepository = configurationRepository;
        this.configuration = loadConfiguration(properties);
        rebuildClients();
    }

    public synchronized AiConfigurationResponse configuration() {
        return configuration.toResponse();
    }

    public synchronized void update(AiConfigurationRequest request) {
        AiProvider provider = request.provider() == null ? configuration.provider() : request.provider();
        if (!StringUtils.hasText(request.baseUrl())) {
            throw new AiConfigurationException(AiConfigurationError.INVALID_CONFIGURATION);
        }
        String apiKey = StringUtils.hasText(request.apiKey()) ? request.apiKey() : configuration.apiKey();
        if (!StringUtils.hasText(apiKey)) {
            throw new AiConfigurationException(AiConfigurationError.INVALID_CONFIGURATION);
        }
        AiConfigurationState updatedConfiguration = new AiConfigurationState(
                provider,
                request.baseUrl(),
                StringUtils.hasText(request.model()) ? request.model() : DEFAULT_MODELS.get(provider),
                apiKey
        );
        configurationRepository.save(new AiConfigurationEntity(
                updatedConfiguration.provider(),
                updatedConfiguration.baseUrl(),
                updatedConfiguration.model(),
                updatedConfiguration.apiKey(),
                Instant.now()
        ));
        configuration = updatedConfiguration;
        rebuildClients();
    }

    public synchronized ChatClient ragChatClient() {
        if (ragChatClient == null) {
            throw new AiConfigurationException(AiConfigurationError.PROVIDER_NOT_CONFIGURED);
        }
        return ragChatClient;
    }

    public synchronized ChatClient carSearchChatClient() {
        if (carSearchChatClient == null) {
            throw new AiConfigurationException(AiConfigurationError.PROVIDER_NOT_CONFIGURED);
        }
        return carSearchChatClient;
    }

    private void rebuildClients() {
        if (!StringUtils.hasText(configuration.apiKey())) {
            ragChatClient = null;
            carSearchChatClient = null;
            return;
        }
        ragChatClient = buildClient(RAG_SYSTEM, true);
        carSearchChatClient = buildClient(CAR_SEARCH_SYSTEM, false);
    }

    private AiConfigurationState loadConfiguration(AiProperties properties) {
        Optional<AiConfigurationEntity> storedConfiguration =
                configurationRepository.findById(AiConfigurationEntity.ID);
        return storedConfiguration
                .map(AiConfigurationState::from)
                .orElseGet(() -> AiConfigurationState.from(properties));
    }

    private ChatClient buildClient(String system, boolean rag) {
        ChatModel chatModel = switch (configuration.provider()) {
            case OPENAI, GROQ, DEEPSEEK -> buildOpenAiCompatibleChatModel();
            case ANTHROPIC -> AnthropicChatModel.builder()
                    .options(AnthropicChatOptions.builder()
                            .apiKey(configuration.apiKey())
                            .model(configuration.model())
                            .build())
                    .build();
        };
        ChatClient.Builder builder = ChatClient.builder(chatModel);
        builder.defaultSystem(system);
        if (rag) {
            builder.defaultAdvisors(
                    MessageChatMemoryAdvisor.builder(chatMemory).build(),
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

    private OpenAiChatModel buildOpenAiCompatibleChatModel() {
        OpenAiChatOptions.Builder options = OpenAiChatOptions.builder()
                .baseUrl(configuration.baseUrl())
                .apiKey(configuration.apiKey())
                .model(configuration.model());
        if (configuration.provider() == AiProvider.GROQ) {
            options.extraBody(Map.of("include_reasoning", false));
        }
        return OpenAiChatModel.builder().options(options.build()).build();
    }

    public record AiConfigurationRequest(AiProvider provider, String baseUrl, String model, String apiKey) {
    }

    public record AiConfigurationResponse(AiProvider provider, String baseUrl, String model, boolean apiKeyConfigured) {
    }

    private record AiConfigurationState(AiProvider provider, String baseUrl, String model, String apiKey) {
        private static AiConfigurationState from(AiProperties properties) {
            AiProvider provider = properties.provider() == null ? AiProvider.OPENAI : properties.provider();
            return new AiConfigurationState(
                    provider,
                    properties.baseUrl(),
                    valueOrDefault(properties.model(), DEFAULT_MODELS.get(provider)),
                    properties.apiKey()
            );
        }

        private static AiConfigurationState from(AiConfigurationEntity configuration) {
            return new AiConfigurationState(
                    configuration.getProvider(),
                    configuration.getBaseUrl(),
                    configuration.getModel(),
                    configuration.getApiKey()
            );
        }

        private AiConfigurationResponse toResponse() {
            return new AiConfigurationResponse(provider, baseUrl, model, StringUtils.hasText(apiKey));
        }

        private static String valueOrDefault(String value, String defaultValue) {
            return StringUtils.hasText(value) ? value : defaultValue;
        }
    }
}
