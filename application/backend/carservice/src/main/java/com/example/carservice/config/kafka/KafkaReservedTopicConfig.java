package com.example.carservice.config.kafka;

import com.example.commonlib.kafka.ReservedConfirmation;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaReservedTopicConfig {

    @Bean
    public NewTopic reservedTopic() {
        return TopicBuilder.name(ReservedConfirmation.TOPIC).build();
    }
}
