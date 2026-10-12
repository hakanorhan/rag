package com.example.notificationservice;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.example.commonlib.kafka.ReservedConfirmation;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ReservedConsumer {

    private final NotificationRecorder notificationRecorder;
    private final JavaMailSender mailSender;

    @KafkaListener(topics = ReservedConfirmation.TOPIC)
    @Transactional
    public void consume(ReservedConfirmation reservedConfirmation) {
        notificationRecorder.recordAndPublish(
                NotificationType.RESERVED_CONFIRMATION,
                reservedConfirmation.reservationId(),
                reservedConfirmation.recipient(),
                reservedConfirmation
        );
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void sendEmail(ReservedConfirmation reservedConfirmation) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@localhost");
        message.setTo(reservedConfirmation.recipient());
        message.setSubject("Reservierung bestätigt");
        message.setText("Ihre Reservierung %d wurde bestätigt."
                .formatted(reservedConfirmation.reservationId()));
        mailSender.send(message);
    }
}
