package com.longdistancebus.review.repo;

import com.longdistancebus.review.domain.CustomerReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerReviewRepository extends JpaRepository<CustomerReview, Long> {
    List<CustomerReview> findByOperatorIdOrderByReviewedAtDesc(Long operatorId);

    List<CustomerReview> findByOperatorIdAndStatusOrderByReviewedAtDesc(Long operatorId, String status);

    List<CustomerReview> findByUserIdOrderByReviewedAtDesc(Long userId);

    List<CustomerReview> findByStatusOrderByReviewedAtDesc(String status);

    List<CustomerReview> findTop10ByOperatorIdAndStatusOrderByReviewedAtDesc(Long operatorId, String status);

    boolean existsByUserIdAndBookingId(Long userId, Long bookingId);

    boolean existsByUserIdAndTripId(Long userId, Long tripId);
}

