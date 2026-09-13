package com.example.aiservice;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@Import(TestcontainersConfiguration.class)
@SpringBootTest(properties = {
		"spring.ai.ollama.init.chat.include=false",
		"spring.ai.ollama.embedding.model=all-minilm",
		"spring.ai.ollama.init.pull-model-strategy=never"
	})
class AiserviceApplicationTests {

	@Test
	void contextLoads() {
	}

}
