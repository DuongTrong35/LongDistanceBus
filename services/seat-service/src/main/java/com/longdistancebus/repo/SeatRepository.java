package com.longdistancebus.repo;

import com.longdistancebus.domain.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, String> {
    List<Seat> findByBusid(String busid);

}
