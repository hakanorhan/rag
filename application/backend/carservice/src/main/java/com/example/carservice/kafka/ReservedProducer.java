package com.example.carservice.kafka;

import com.example.commonlib.kafka.ReservedConfirmation;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Service
@RequiredArgsConstructor
public class ReservedProducer {

    private final KafkaTemplate<String, ReservedConfirmation> kafkaTemplate;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void sendReservedConfirmation(ReservedConfirmation reservedConfirmation) {
        kafkaTemplate.send(
                ReservedConfirmation.TOPIC,
                reservedConfirmation.reservationId().toString(),
                reservedConfirmation
        );
    }
}
