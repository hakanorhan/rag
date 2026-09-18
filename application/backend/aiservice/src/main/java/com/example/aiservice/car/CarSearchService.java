package com.example.aiservice.car;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.example.commonlib.car.CarDTO;
import com.example.aiservice.AiChatClientService;

@Service
public class CarSearchService {

    private static final Logger log = LoggerFactory.getLogger(CarSearchService.class);
    private static final ZoneId RENTAL_TIME_ZONE = ZoneId.of("Europe/Berlin");
    private static final LocalTime DEFAULT_RENTAL_TIME = LocalTime.of(10, 0);
    private final AiChatClientService aiChatClientService;
    private final CarServiceClient carServiceClient;
    private final CacheManager cacheManager;

    public CarSearchService(
            AiChatClientService aiChatClientService,
            CarServiceClient carServiceClient,
            CacheManager cacheManager
    ) {
        this.aiChatClientService = aiChatClientService;
        this.carServiceClient = carServiceClient;
        this.cacheManager = cacheManager;
    }

    @Cacheable(cacheNames = "freeTextSearches", key = "#message.trim().toLowerCase(T(java.util.Locale).ROOT)", sync = true)
    public CarSearchResponse search(String message) {
        Instant now = Instant.now();
        CarSearchCriteria criteria = aiChatClientService.carSearchChatClient().prompt()
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
            throw new CarSearchException(CarSearchError.SEARCH_PARAMETERS_UNAVAILABLE);
        }

        Instant pickupAt = criteria.pickupAt();
        Instant returnAt = criteria.returnAt();

        log.info("pickupAt={}, returnAt={}", pickupAt, returnAt);

        RentalPeriod period = completeRentalPeriod(pickupAt, returnAt);
        pickupAt = period.pickupAt();
        returnAt = period.returnAt();

        validatePeriod(pickupAt, returnAt);

        List<CarDTO> cars = carServiceClient.search(
                criteria.carCategory(),
                criteria.carType(),
                criteria.location(),
                toRequestParameter(pickupAt),
                toRequestParameter(returnAt)
        );

        CarSearchResponse response = new CarSearchResponse(
                cars == null ? List.of() : cars,
                criteria.location(),
                criteria.returnLocation(),
                pickupAt,
                returnAt,
                UUID.randomUUID().toString(),
                message.trim()
        );
        idCache().put(response.searchId(), response);
        return response;
    }

    public CarSearchResponse findById(String searchId) {
        CarSearchResponse response = idCache().get(searchId, CarSearchResponse.class);
        if (response == null) {
            return response;
        }
        RentalPeriod period = completeRentalPeriod(response.pickupAt(), response.returnAt());
        if (Objects.equals(response.pickupAt(), period.pickupAt())
                && Objects.equals(response.returnAt(), period.returnAt())) {
            return response;
        }
        CarSearchResponse updated = new CarSearchResponse(
                response.cars(),
                response.pickupLocation(),
                response.returnLocation(),
                period.pickupAt(),
                period.returnAt(),
                response.searchId(),
                response.searchQuery()
        );
        idCache().put(searchId, updated);
        return updated;
    }

    static RentalPeriod completeRentalPeriod(Instant pickupAt, Instant returnAt) {
        if (pickupAt == null && returnAt == null) {
            RentalPeriod period = defaultRentalPeriod();
            log.info("default rental period pickupAt={}, returnAt={}", period.pickupAt(), period.returnAt());
            return period;
        }
        if (pickupAt != null && returnAt == null) {
            Instant generatedReturnAt = pickupAt
                    .atZone(RENTAL_TIME_ZONE)
                    .plusWeeks(1)
                    .toInstant();
            log.info("generated returnAt={} from pickupAt={}", generatedReturnAt, pickupAt);
            return new RentalPeriod(pickupAt, generatedReturnAt);
        }
        return new RentalPeriod(pickupAt, returnAt);
    }

    private static RentalPeriod defaultRentalPeriod() {
        LocalDate tomorrow = LocalDate.now(RENTAL_TIME_ZONE).plusDays(1);
        return new RentalPeriod(
                tomorrow.atTime(DEFAULT_RENTAL_TIME).atZone(RENTAL_TIME_ZONE).toInstant(),
                tomorrow.plusWeeks(1).atTime(DEFAULT_RENTAL_TIME).atZone(RENTAL_TIME_ZONE).toInstant()
        );
    }

    record RentalPeriod(Instant pickupAt, Instant returnAt) {
    }

    private Cache idCache() {
        return Objects.requireNonNull(cacheManager.getCache("freeTextSearchesById"));
    }

    private void validatePeriod(Instant pickupAt, Instant returnAt) {
        if (pickupAt != null && returnAt != null
                && pickupAt.plus(2, java.time.temporal.ChronoUnit.HOURS).isAfter(returnAt)) {
            throw new CarSearchException(CarSearchError.INVALID_RENTAL_PERIOD);
        }
    }

    private String toRequestParameter(Instant timestamp) {
        return timestamp == null ? null : timestamp.toString();
    }
}
