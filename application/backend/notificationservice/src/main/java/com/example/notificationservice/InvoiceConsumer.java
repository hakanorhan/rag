package com.example.notificationservice;

import java.time.Instant;

import com.example.commonlib.kafka.PaidConfirmation;
import com.itextpdf.text.DocumentException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class InvoiceConsumer {

    private final NotificationRepository notificationRepository;
    private final CompanyInfoRepository companyInfoRepository;
    private final InvoicePdf invoicePdf;
    private final JavaMailSender mailSender;
    private final ApplicationEventPublisher eventPublisher;

    @KafkaListener(topics = PaidConfirmation.TOPIC)
    @Transactional
    public void consume(PaidConfirmation payment) {
        Notification notification = new Notification();
        notification.setType(NotificationType.INVOICE);
        notification.setNotificationDate(Instant.now());
        notification.setReservationId(payment.reservationId());
        notification.setRecipient(payment.recipient());
        notificationRepository.save(notification);
        eventPublisher.publishEvent(payment);
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void sendInvoice(PaidConfirmation payment) throws MessagingException, DocumentException {
        CompanyInfo company = companyInfoRepository.findById(1L).orElseThrow();
        byte[] pdf = invoicePdf.create(company, payment);
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom("noreply@localhost");
        helper.setTo(payment.recipient());
        helper.setSubject("Musterrechnung " + invoicePdf.invoiceNumber(payment));
        helper.setText("Ihre Musterrechnung zur Reservierung " + payment.reservationId() + " ist beigefügt.");
        helper.addAttachment("Musterrechnung-" + invoicePdf.invoiceNumber(payment) + ".pdf",
                new ByteArrayResource(pdf), "application/pdf");
        mailSender.send(message);
    }
}
