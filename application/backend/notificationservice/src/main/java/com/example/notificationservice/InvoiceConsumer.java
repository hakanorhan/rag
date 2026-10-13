package com.example.notificationservice;

import java.io.IOException;

import com.example.commonlib.kafka.PaidConfirmation;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class InvoiceConsumer {

    private final NotificationRecorder notificationRecorder;
    private final CompanyInfoRepository companyInfoRepository;
    private final InvoicePdf invoicePdf;
    private final JavaMailSender mailSender;

    @KafkaListener(topics = PaidConfirmation.TOPIC)
    @Transactional
    public void consume(PaidConfirmation payment) {
        notificationRecorder.recordAndPublish(
                NotificationType.INVOICE,
                payment.reservationId(),
                payment.recipient(),
                payment
        );
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void sendInvoice(PaidConfirmation payment) throws MessagingException, IOException {
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
