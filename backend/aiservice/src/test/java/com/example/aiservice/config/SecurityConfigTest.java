package com.example.aiservice.config;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.aiservice.car.CarSearchController;
import com.example.aiservice.car.CarSearchService;
import com.example.aiservice.rag.ChatController;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest({ChatController.class, CarSearchController.class})
@Import(SecurityConfig.class)
class SecurityConfigTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    ChatClient chatClient;

    @MockitoBean
    CarSearchService carSearchService;

    @MockitoBean
    JwtDecoder jwtDecoder;

    @ParameterizedTest
    @ValueSource(strings = {"/api/ai/chat", "/api/ai/cars/search"})
    void shouldReachPublicPostEndpointValidationWithoutToken(String endpoint) throws Exception {
        mockMvc.perform(post(endpoint)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }
}
