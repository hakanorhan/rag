package com.example.aiservice.rag;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@RestController
@RequestMapping("/api/ai/chat")
public class ChatController {

    private final RagChatService ragChatService;

    public ChatController(RagChatService ragChatService) {
        this.ragChatService = ragChatService;
    }

    @PostMapping
    public ChatResponse chat(@Valid @RequestBody ChatRequest request) {
        return ragChatService.chat(request);
    }

    public record ChatRequest(
            @NotBlank @Size(max = 4_000) String message,
            UUID conversationId
    ) {
    }

    public record ChatResponse(
            UUID conversationId,
            String answer,
            List<RagSource> sources
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
