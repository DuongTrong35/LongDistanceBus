package com.example.LongDistanceBus.repo;

import com.example.LongDistanceBus.domain.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {

    // Tìm chuyến theo fromStation/toStation trong khoảng thời gian 1 ngày
    List<Trip> findByRoute_FromStation_IdAndRoute_ToStation_IdAndDepartureTimeBetween(
            Long fromId,
            Long toId,
            LocalDateTime start,
            LocalDateTime end
    );
}
