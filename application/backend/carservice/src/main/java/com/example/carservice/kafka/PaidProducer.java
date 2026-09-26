package com.example.carservice.kafka;

import com.example.commonlib.kafka.PaidConfirmation;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaidProducer {

    private final KafkaTemplate<String, PaidConfirmation> kafkaTemplate;

    public void sendPaidConfirmation(PaidConfirmation paidConfirmation) {
        kafkaTemplate.send(
                PaidConfirmation.TOPIC,
                paidConfirmation.reservationId().toString(),
                paidConfirmation
        ).join();
    }
}
