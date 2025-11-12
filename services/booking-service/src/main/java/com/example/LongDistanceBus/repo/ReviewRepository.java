package com.example.LongDistanceBus.repo;

import com.example.LongDistanceBus.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByOperator_Id(Long operatorId);

    List<Review> findByBus_Id(Long busId);

    List<Review> findByTrip_Id(Long tripId);
}

