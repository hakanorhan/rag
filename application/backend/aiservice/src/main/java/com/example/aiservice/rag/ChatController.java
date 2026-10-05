package com.example.aiservice.rag;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/ai/chat")
public class ChatController {

    private final RagChatService ragChatService;

    public ChatController(RagChatService ragChatService) {
        this.ragChatService = ragChatService;
    }

    @PostMapping(produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<Map<String, String>>> chat(
            @Valid @RequestBody ChatRequest request
    ) {
        return ragChatService.stream(request);
    }

    public record ChatRequest(
            @NotEmpty @Size(max = 20) List<@NotNull @Valid ChatMessage> messages,
            @NotBlank @Pattern(regexp = "de|en") String locale
    ) {
    }

    public record ChatMessage(
            @NotBlank @Pattern(regexp = "user|assistant") String role,
            @NotBlank @Size(max = 4_000) String content
    ) {
    }

    public record RagSource(
            UUID documentId,
            String fileName,
            int page,
            String chunkId,
            Double similarityScore
    ) {
    }
}
