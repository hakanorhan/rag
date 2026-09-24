package com.example.carservice.config.kafka;

import com.example.commonlib.kafka.PaidConfirmation;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaPaidTopicConfig {

    @Bean
    public NewTopic paidTopic() {
        return TopicBuilder.name(PaidConfirmation.TOPIC).build();
    }
}
