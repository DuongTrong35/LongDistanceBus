package com.longdistancebus.repo;
import com.longdistancebus.domain.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TripRepository  extends JpaRepository<Trip, String> {
    List<Trip> findAllByBusid(String busid);
    List<Trip> findByBusid(String busid);

}