package com.example.notificationservice;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Currency;
import java.util.Locale;

import com.example.commonlib.kafka.PaidConfirmation;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import org.springframework.stereotype.Component;

@Component
public class InvoicePdf {

    private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("dd.MM.yyyy")
            .withZone(ZoneId.of("Europe/Berlin"));
    public byte[] create(CompanyInfo company, PaidConfirmation payment) throws IOException {
        BigDecimal net = payment.amount().divide(BigDecimal.ONE.add(company.getVatRate()), 2, RoundingMode.HALF_UP);
        BigDecimal vat = payment.amount().subtract(net);
        NumberFormat money = NumberFormat.getCurrencyInstance(Locale.GERMANY);
        money.setCurrency(Currency.getInstance(payment.currency()));
        String number = invoiceNumber(payment);
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        try (Document document = new Document(new PdfDocument(new PdfWriter(output)))) {
            PdfFont text = PdfFontFactory.createFont(StandardFonts.HELVETICA);
            PdfFont title = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
            document.setFont(text).setFontSize(11);
            document.add(new Paragraph("Musterrechnung " + number).setFont(title).setFontSize(18));
            document.add(line("Testdaten – kein gültiger Steuerbeleg"));
            document.add(line("Ausgestellt am: " + DATE.format(payment.paidAt())));
            document.add(line("Zahlungseingang: " + DATE.format(payment.paidAt())));
            document.add(line("Reservierung: " + payment.reservationId()));
            document.add(line(" "));
            document.add(line("Rechnungsaussteller"));
            document.add(line(company.getName()));
            document.add(line(company.getStreet()));
            document.add(line(company.getPostalCode() + " " + company.getCity()));
            document.add(line(company.getCountry()));
            if (company.getTaxNumber() != null) document.add(line("Steuernummer: " + company.getTaxNumber()));
            if (company.getVatId() != null) document.add(line("USt-IdNr.: " + company.getVatId()));
            document.add(line(" "));
            document.add(line("Rechnungsempfänger: " + payment.recipient()));
            document.add(line(" "));
            document.add(line("1 × Fahrzeugmiete " + payment.carCategory() + " inkl. gebuchter Optionen"));
            document.add(line("Voraussichtlicher Leistungszeitraum: " + DATE.format(payment.pickupAt())
                    + " – " + DATE.format(payment.returnAt())));
            document.add(line("Netto: " + money.format(net)));
            document.add(line("Umsatzsteuer (" + company.getVatRate().movePointRight(2).stripTrailingZeros().toPlainString()
                    + " %): " + money.format(vat)));
            document.add(line("Gesamtbetrag: " + money.format(payment.amount())));
            document.add(line("Bereits per PayPal bezahlt."));
        }
        return output.toByteArray();
    }

    public String invoiceNumber(PaidConfirmation payment) {
        return "RAG-" + DATE.format(payment.paidAt()).substring(6) + "-" + payment.paymentId();
    }

    private Paragraph line(String text) {
        return new Paragraph(text);
    }
}
