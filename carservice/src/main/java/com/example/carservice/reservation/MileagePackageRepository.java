package com.example.carservice.reservation;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MileagePackageRepository extends JpaRepository<MileagePackage, Long> {
    List<MileagePackage> findAllByOrderByIdAsc();
}
