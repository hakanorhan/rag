package com.example.carservice.reservation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    @EntityGraph(attributePaths = {
            "car", "car.carType", "car.location", "pickupLocation", "returnLocation",
            "mileagePackage", "extras", "extras.extra"
    })
    List<Reservation> findAllByUserKeycloakIdOrderByPickupAtDesc(String keycloakId);

    Optional<Reservation> findByUserKeycloakIdAndIdempotencyKey(String keycloakId, String idempotencyKey);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM Reservation r WHERE r.id = :id AND r.user.keycloakId = :keycloakId")
    Optional<Reservation> findOwnedForUpdate(@Param("id") Long id, @Param("keycloakId") String keycloakId);
}
