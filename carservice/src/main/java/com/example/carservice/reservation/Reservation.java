package com.example.carservice.reservation;

import com.example.carservice.car.Car;
import com.example.carservice.car.Location;
import com.example.carservice.car.ReservationStatus;
import com.example.carservice.car.User;
import com.example.carservice.car.ReservationExtra;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "reservation")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "car_id", nullable = false)
    private Car car;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pickup_location_id", nullable = false)
    private Location pickupLocation;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "return_location_id", nullable = false)
    private Location returnLocation;

    @Column(name = "pickup_at", nullable = false)
    private Instant pickupAt;

    @Column(name = "return_at", nullable = false)
    private Instant returnAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ReservationStatus status = ReservationStatus.RESERVED;

    @Column(name = "daily_rate", nullable = false, precision = 10, scale = 2)
    private BigDecimal dailyRate;

    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "mileage_package_id", nullable = false)
    private MileagePackage mileagePackage;

    @Column(name = "included_km_per_day")
    private Integer includedKmPerDay;

    @Column(name = "mileage_price_per_day", nullable = false, precision = 10, scale = 2)
    private BigDecimal mileagePricePerDay;

    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReservationExtra> extras = new ArrayList<>();

    @Column(name = "search_query", length = 500)
    private String searchQuery;

    public long getRentalDays() {
        var period = Duration.between(pickupAt, returnAt);
        long days = period.toDays();
        return period.equals(Duration.ofDays(days)) ? days : days + 1;
    }

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();
}
