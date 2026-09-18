package com.example.aiservice;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/ai-config")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AiAdminController {

    private final AiChatClientService aiChatClientService;

    @GetMapping
    public AiChatClientService.AiConfigurationResponse configuration() {
        return aiChatClientService.configuration();
    }

    @PutMapping
    public AiChatClientService.AiConfigurationResponse update(
            @RequestBody AiChatClientService.AiConfigurationRequest request) {
        aiChatClientService.update(request);
        return aiChatClientService.configuration();
    }
}
