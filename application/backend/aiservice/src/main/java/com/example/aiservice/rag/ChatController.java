package com.example.aiservice.rag;

import java.util.UUID;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
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
    public ResponseEntity<Flux<ServerSentEvent<String>>> chat(
            @Valid @RequestBody ChatRequest request
    ) {
        RagChatService.ChatStream stream = ragChatService.stream(request);
        return ResponseEntity.ok()
                .header("X-Conversation-Id", stream.conversationId().toString())
                .body(stream.events());
    }

    public record ChatRequest(
            @NotBlank @Size(max = 4_000) String message,
            UUID conversationId,
            @NotBlank @Pattern(regexp = "de|en") String locale
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
