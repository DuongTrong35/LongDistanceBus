package com.example.LongDistanceBus.repo;

import com.example.LongDistanceBus.domain.Bus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BusRepository extends JpaRepository<Bus, Long> {
    Optional<Bus> findByPlate(String plate);

    List<Bus> findByOperator_Id(Long operatorId);
}

