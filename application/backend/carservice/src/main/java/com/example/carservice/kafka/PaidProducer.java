package com.example.carservice.kafka;

import com.example.commonlib.kafka.PaidConfirmation;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Service
@RequiredArgsConstructor
public class PaidProducer {

    private final KafkaTemplate<String, PaidConfirmation> kafkaTemplate;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void sendPaidConfirmation(PaidConfirmation paidConfirmation) {
        kafkaTemplate.send(
                PaidConfirmation.TOPIC,
                paidConfirmation.reservationId().toString(),
                paidConfirmation
        );
    }
}
