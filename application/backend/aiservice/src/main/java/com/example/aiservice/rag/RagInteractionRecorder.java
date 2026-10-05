package com.example.aiservice.rag;

import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Component;

import com.example.aiservice.rag.ChatController.RagSource;

@Component
public class RagInteractionRecorder {

    private final RagInteractionRepository interactionRepository;

    public RagInteractionRecorder(RagInteractionRepository interactionRepository) {
        this.interactionRepository = interactionRepository;
    }

    public void record(String question, String answer, String model, long responseTime,
            Instant startedAt, List<RagSource> sources) {
        RagInteraction interaction = new RagInteraction(question, answer, model, responseTime, startedAt);
        sources.forEach(source -> interaction.addSource(
                source.documentId(), source.fileName(), source.page(), source.chunkId(), source.similarityScore()
        ));
        interactionRepository.save(interaction);
    }
}
