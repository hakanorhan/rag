package com.example.carservice.car;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExtraRepository extends JpaRepository<Extra, Long> {
    List<Extra> findAllByOrderByIdAsc();
}
