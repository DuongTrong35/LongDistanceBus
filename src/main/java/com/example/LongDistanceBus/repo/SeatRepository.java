package com.example.LongDistanceBus.repo;

import com.example.LongDistanceBus.domain.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByBus_Id(Long busId);
}
