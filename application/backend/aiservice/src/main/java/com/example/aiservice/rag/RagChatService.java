package com.example.aiservice.rag;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.stereotype.Service;

import com.example.aiservice.AiChatClientService;

import reactor.core.publisher.Flux;

@Service
public class RagChatService {

    private final AiChatClientService aiChatClientService;
    private final RagInteractionRecorder interactionRecorder;

    public RagChatService(AiChatClientService aiChatClientService, RagInteractionRecorder interactionRecorder) {
        this.aiChatClientService = aiChatClientService;
        this.interactionRecorder = interactionRecorder;
    }

    public Flux<ServerSentEvent<Map<String, String>>> stream(ChatController.ChatRequest request) {
        return Flux.defer(() -> streamRequest(request));
    }

    private Flux<ServerSentEvent<Map<String, String>>> streamRequest(ChatController.ChatRequest request) {
        Instant startedAt = Instant.now();
        long startedAtNanos = System.nanoTime();
        List<Message> history = request.messages().stream()
                .map(message -> message.role().equals("user")
                        ? (Message) new UserMessage(message.content())
                        : new AssistantMessage(message.content()))
                .toList();
        String question = request.messages().getLast().content();
        String model = aiChatClientService.configuration().model();
        RagChatResponseEvents responseEvents = new RagChatResponseEvents(request.locale());

        return aiChatClientService.ragChatClient().prompt()
                .system(system -> system.param("language", responseLanguage(request.locale())))
                .messages(history)
                .stream()
                .chatClientResponse()
                .concatMap(response -> Flux.fromIterable(responseEvents.accept(response)))
                .doOnComplete(() -> interactionRecorder.record(
                        question,
                        responseEvents.answer(),
                        model,
                        (System.nanoTime() - startedAtNanos) / 1_000_000,
                        startedAt,
                        responseEvents.sources()
                ));
    }

    private static String responseLanguage(String locale) {
        return "en".equals(locale) ? "Englisch" : "Deutsch";
    }
}
