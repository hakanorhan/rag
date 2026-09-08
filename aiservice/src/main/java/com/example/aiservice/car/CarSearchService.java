package com.example.aiservice.car;

import java.time.Instant;
import java.util.List;

import com.example.commonlib.car.CarDTO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CarSearchService {

    private static final Logger log = LoggerFactory.getLogger(CarSearchService.class);
    private final ChatClient chatClient;
    private final CarServiceClient carServiceClient;

    public CarSearchService(
            ChatClient.Builder chatClientBuilder,
            CarServiceClient carServiceClient
    ) {
        this.chatClient = chatClientBuilder
                .defaultSystem("""
                        Du wandelst eine deutsch- oder englischsprachige Mietwagensuche
                        ausschließlich in strukturierte Suchparameter um.

                        Erlaubte Felder:
                        - brand: Fahrzeugmarke
                        - model: Fahrzeugmodell
                        - carType: vorhandene Fahrzeugkategorie
                        - location: Abholort
                        - pickupAt: Abholzeit als ISO-8601-Zeitpunkt mit Zeitzonen-Offset
                        - returnAt: Rückgabezeit als ISO-8601-Zeitpunkt mit Zeitzonen-Offset

                        Lasse nicht genannte oder nicht eindeutig ableitbare Felder aus der
                        strukturierten Ausgabe weg. Gib für solche Felder nicht null aus.
                        Erfinde keine Werte. Angaben zu Sitzen, Personen oder Einsatzzweck
                        werden ignoriert, weil diese Filter nicht im Datenmodell vorhanden sind.
                        Bei einem Datum ohne Uhrzeit verwende 10:00 Uhr in Europe/Berlin.
                        Setze pickupAt und returnAt nur, wenn beide Zeitpunkte aus der
                        Suchanfrage ableitbar sind. Andernfalls lasse beide Felder weg.
                        """)
                .build();
        this.carServiceClient = carServiceClient;
    }

    public CarSearchResponse search(String message) {
        Instant now = Instant.now();
        CarSearchCriteria criteria = chatClient.prompt()
                .user(user -> user.text("""
                                Aktueller Zeitpunkt: {now}

                                Suchanfrage:
                                {message}
                                """)
                        .param("now", now)
                        .param("message", message))
                .call()
                .entity(CarSearchCriteria.class);

        if (criteria == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Suchparameter konnten nicht ermittelt werden"
            );
        }

        Instant pickupAt = criteria.pickupAt();
        Instant returnAt = criteria.returnAt();

        log.info("pickupAt={}, returnAt={}", pickupAt, returnAt);

        if ((pickupAt == null) != (returnAt == null)) {
            pickupAt = null;
            returnAt = null;
            log.info("isNull pickupAt={}, returnAt={}", pickupAt, returnAt);
        }

        validatePeriod(pickupAt, returnAt);

        List<CarDTO> cars = carServiceClient.search(
                criteria.brand(),
                criteria.model(),
                criteria.carType(),
                criteria.location(),
                toRequestParameter(pickupAt),
                toRequestParameter(returnAt)
        );

        return new CarSearchResponse(
                cars == null ? List.of() : cars,
                pickupAt,
                returnAt
        );
    }

    private void validatePeriod(Instant pickupAt, Instant returnAt) {
        if (pickupAt != null && !pickupAt.isBefore(returnAt)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Abhol- und Rückgabezeitraum ist ungültig"
            );
        }
    }

    private String toRequestParameter(Instant timestamp) {
        return timestamp == null ? null : timestamp.toString();
    }
}
