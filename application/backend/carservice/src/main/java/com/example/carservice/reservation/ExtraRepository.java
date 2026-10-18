package com.example.carservice.reservation;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExtraRepository extends JpaRepository<Extra, Long> {
    List<Extra> findAllByOrderByIdAsc();
}
