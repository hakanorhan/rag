package com.example.carservice.kafka;

import com.example.commonlib.kafka.ReservedConfirmation;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReservedProducer {

    private final KafkaTemplate<String, ReservedConfirmation> kafkaTemplate;

    public void sendReservedConfirmation(ReservedConfirmation reservedConfirmation) {
        kafkaTemplate.send(
                ReservedConfirmation.TOPIC,
                reservedConfirmation.reservationId().toString(),
                reservedConfirmation
        );
    }
}
