package com.example.carservice.reservation;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Component;


@Component
public class ReservationPricing {

    public void applyOptions(Reservation reservation, MileagePackage mileagePackage,
            Set<Long> selectedExtraIds, List<Extra> selectedExtras) {
        if (!reservation.getMileagePackage().getId().equals(mileagePackage.getId())) {
            reservation.setMileagePackage(mileagePackage);
            reservation.setIncludedKmPerDay(mileagePackage.getIncludedKmPerDay());
            reservation.setMileagePricePerDay(mileagePackage.getPricePerDay());
        }

        reservation.getExtras().removeIf(selected -> !selectedExtraIds.contains(selected.getExtra().getId()));
        for (Extra extra : selectedExtras) {
            boolean alreadySelected = reservation.getExtras().stream()
                    .anyMatch(selected -> selected.getExtra().getId().equals(extra.getId()));
            if (!alreadySelected) {
                ReservationExtra selected = new ReservationExtra();
                selected.setReservation(reservation);
                selected.setExtra(extra);
                selected.setUnitPrice(extra.getPricePerDay());
                reservation.getExtras().add(selected);
            }
        }
        recalculateTotal(reservation);
    }

    public void recalculateTotal(Reservation reservation) {
        BigDecimal extrasPerDay = BigDecimal.ZERO;
        for (ReservationExtra extra : reservation.getExtras()) {
            extrasPerDay = extrasPerDay.add(extra.getUnitPrice());
        }
        BigDecimal dailyTotal = reservation.getDailyRate()
                .add(reservation.getMileagePricePerDay())
                .add(extrasPerDay);
        reservation.setTotalPrice(dailyTotal.multiply(BigDecimal.valueOf(reservation.getRentalDays())));
    }
}
