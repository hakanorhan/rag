package com.example.notificationservice;

import java.time.Instant;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
class NotificationRecorder {

    private final NotificationRepository notificationRepository;
    private final ApplicationEventPublisher eventPublisher;

    void recordAndPublish(NotificationType type, Long reservationId, String recipient, Object event) {
        Notification notification = new Notification();
        notification.setType(type);
        notification.setNotificationDate(Instant.now());
        notification.setReservationId(reservationId);
        notification.setRecipient(recipient);
        notificationRepository.save(notification);
        eventPublisher.publishEvent(event);
    }
}
