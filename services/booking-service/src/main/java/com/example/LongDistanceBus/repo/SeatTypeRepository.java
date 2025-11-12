package com.example.LongDistanceBus.repo;

import com.example.LongDistanceBus.domain.SeatType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SeatTypeRepository extends JpaRepository<SeatType, Long> {
    Optional<SeatType> findByCode(String code);
}

