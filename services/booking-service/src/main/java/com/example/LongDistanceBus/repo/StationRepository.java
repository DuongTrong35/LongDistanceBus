package com.example.LongDistanceBus.repo;

import com.example.LongDistanceBus.domain.Station;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StationRepository extends JpaRepository<Station, Long> {
    List<Station> findByCityIgnoreCaseOrderByNameAsc(String city);
}
