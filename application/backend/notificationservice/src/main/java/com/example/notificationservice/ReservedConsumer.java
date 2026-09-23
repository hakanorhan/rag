package com.example.notificationservice;

import java.time.Instant;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.example.commonlib.kafka.ReservedConfirmation;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ReservedConsumer {

    private final NotificationRepository notificationRepository;
    private final JavaMailSender mailSender;

    @KafkaListener(topics = ReservedConfirmation.TOPIC)
    @Transactional
    public void consume(ReservedConfirmation reservedConfirmation) {
        Notification notification = new Notification();
        notification.setType(NotificationType.RESERVED_CONFIRMATION);
        notification.setNotificationDate(Instant.now());
        notification.setReservationId(reservedConfirmation.reservationId());
        notification.setRecipient(reservedConfirmation.recipient());
        notificationRepository.save(notification);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@localhost");
        message.setTo(reservedConfirmation.recipient());
        message.setSubject("Reservierung bestätigt");
        message.setText("Ihre Reservierung %d wurde bestätigt."
                .formatted(reservedConfirmation.reservationId()));
        mailSender.send(message);
    }
}
