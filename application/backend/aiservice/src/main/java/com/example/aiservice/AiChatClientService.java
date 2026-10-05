package com.example.aiservice;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
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

    private final AiConfigurationRepository configurationRepository;
    private final AiChatClientFactory clientFactory;
    private AiConfigurationState configuration;
    private ChatModel chatModel;
    private ChatClient ragChatClient;
    private ChatClient carSearchChatClient;

    public AiChatClientService(AiProperties properties, AiConfigurationRepository configurationRepository,
            AiChatClientFactory clientFactory) {
        this.configurationRepository = configurationRepository;
        this.clientFactory = clientFactory;
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

    public synchronized ChatModel chatModel() {
        if (chatModel == null) {
            throw new AiConfigurationException(AiConfigurationError.PROVIDER_NOT_CONFIGURED);
        }
        return chatModel;
    }

    private void rebuildClients() {
        if (!StringUtils.hasText(configuration.apiKey())) {
            chatModel = null;
            ragChatClient = null;
            carSearchChatClient = null;
            return;
        }
        AiChatClientFactory.Clients clients = clientFactory.create(
                configuration.provider(), configuration.baseUrl(), configuration.model(), configuration.apiKey());
        chatModel = clients.model();
        ragChatClient = clients.rag();
        carSearchChatClient = clients.carSearch();
    }

    private AiConfigurationState loadConfiguration(AiProperties properties) {
        Optional<AiConfigurationEntity> storedConfiguration =
                configurationRepository.findById(AiConfigurationEntity.ID);
        return storedConfiguration
                .map(AiConfigurationState::from)
                .orElseGet(() -> AiConfigurationState.from(properties));
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
