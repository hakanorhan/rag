package com.example.carservice.car;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;

public interface CarRepository extends JpaRepository<Car, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Override
    Optional<Car> findById(Long id);

    @EntityGraph(attributePaths = {"carType", "location"})
    List<Car> findAllBy();

    @EntityGraph(attributePaths = {"carType", "location"})
    @Query("""
            SELECT c
            FROM Car c
            WHERE (:carCategory IS NULL OR LOWER(c.carCategory) = LOWER(CAST(:carCategory AS string)))
              AND (:carType IS NULL OR LOWER(c.carType.name) = LOWER(CAST(:carType AS string)))
              AND (:location IS NULL OR LOWER(c.location.name) = LOWER(CAST(:location AS string)))
              AND (
                    (
                        :hasPeriod = false
                        AND c.status = com.example.commonlib.car.CarStatus.AVAILABLE
                    )
                    OR
                    (
                        :hasPeriod = true
                        AND c.status = com.example.commonlib.car.CarStatus.AVAILABLE
                        AND NOT EXISTS (
                            SELECT r.id
                            FROM Reservation r
                            WHERE r.car = c
                              AND r.status IN (
                                  com.example.carservice.car.ReservationStatus.RESERVED,
                                  com.example.carservice.car.ReservationStatus.ACTIVE
                              )
                              AND r.pickupAt < :returnAt
                              AND r.returnAt > :pickupAt
                        )
                    )
              )
            """)
    List<Car> search(
            @Param("carCategory") String carCategory,
            @Param("carType") String carType,
            @Param("location") String location,
            @Param("hasPeriod") boolean hasPeriod,
            @Param("pickupAt") Instant pickupAt,
            @Param("returnAt") Instant returnAt
    );
}
