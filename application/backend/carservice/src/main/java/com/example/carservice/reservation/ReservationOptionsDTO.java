package com.example.carservice.reservation;

import java.math.BigDecimal;
import java.util.List;

public record ReservationOptionsDTO(List<MileageOption> mileagePackages, List<ExtraOption> extras) {
    public record MileageOption(Long id, String name, Integer includedKmPerDay, BigDecimal pricePerDay) {}
    public record ExtraOption(Long id, String name, String description, BigDecimal pricePerDay) {}
}
