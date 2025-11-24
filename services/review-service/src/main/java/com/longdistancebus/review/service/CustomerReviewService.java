package com.longdistancebus.review.service;

import com.longdistancebus.review.domain.CustomerReview;
import com.longdistancebus.review.repo.CustomerReviewRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
public class CustomerReviewService {
    private static final Set<String> ALLOWED_STATUSES = Set.of("PUBLISHED", "HIDDEN", "FLAGGED", "DELETED");

    private final CustomerReviewRepository reviewRepository;

    public CustomerReviewService(CustomerReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public List<CustomerReview> getAllReviews() {
        return reviewRepository.findAll(Sort.by(Sort.Direction.DESC, "reviewedAt"));
    }

    public Optional<CustomerReview> getReviewById(Long id) {
        return reviewRepository.findById(id);
    }

    public List<CustomerReview> getReviewsForOperator(Long operatorId, String status) {
        if (status == null || status.isBlank()) {
            return reviewRepository.findByOperatorIdOrderByReviewedAtDesc(operatorId);
        }
        validateStatus(status);
        return reviewRepository.findByOperatorIdAndStatusOrderByReviewedAtDesc(operatorId, status);
    }

    public List<CustomerReview> getReviewsForUser(Long userId) {
        return reviewRepository.findByUserIdOrderByReviewedAtDesc(userId);
    }

    public List<CustomerReview> getReviewsByStatus(String status) {
        validateStatus(status);
        return reviewRepository.findByStatusOrderByReviewedAtDesc(status);
    }

    public List<CustomerReview> getRecentPublishedReviews(Long operatorId, int limit) {
        if (limit <= 0 || limit > 50) {
            limit = 10;
        }
        return reviewRepository
                .findTop10ByOperatorIdAndStatusOrderByReviewedAtDesc(operatorId, "PUBLISHED")
                .stream()
                .limit(limit)
                .toList();
    }

    public CustomerReview createReview(CustomerReview review) {
        validateRating(review.getRating());
        if (review.getStatus() != null) {
            validateStatus(review.getStatus());
        }
        ensureUniquePerBookingOrTrip(review);
        return reviewRepository.save(review);
    }

    public CustomerReview updateReview(Long id, CustomerReview payload) {
        validateRating(payload.getRating());
        if (payload.getStatus() != null) {
            validateStatus(payload.getStatus());
        }

        return reviewRepository.findById(id).map(existing -> {
            existing.setRating(payload.getRating());
            existing.setTitle(payload.getTitle());
            existing.setContent(payload.getContent());

            if (payload.getStatus() != null && !payload.getStatus().isBlank()) {
                existing.setStatus(payload.getStatus());
            }

            if (payload.getTripId() != null) {
                existing.setTripId(payload.getTripId());
            }
            if (payload.getBookingId() != null) {
                existing.setBookingId(payload.getBookingId());
            }

            return reviewRepository.save(existing);
        }).orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đánh giá với ID: " + id));
    }

    public CustomerReview updateStatus(Long id, String status) {
        validateStatus(status);
        return reviewRepository.findById(id).map(review -> {
            review.setStatus(status);
            return reviewRepository.save(review);
        }).orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đánh giá với ID: " + id));
    }

    public void deleteReview(Long id) {
        reviewRepository.findById(id).ifPresentOrElse(review -> {
            review.setStatus("DELETED");
            reviewRepository.save(review);
        }, () -> {
            throw new IllegalArgumentException("Không tìm thấy đánh giá với ID: " + id);
        });
    }

    private void validateRating(Short rating) {
        if (rating == null || rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Điểm đánh giá phải nằm trong khoảng 1 - 5");
        }
    }

    private void validateStatus(String status) {
        if (!ALLOWED_STATUSES.contains(status)) {
            throw new IllegalArgumentException("Trạng thái không hợp lệ: " + status);
        }
    }

    private void ensureUniquePerBookingOrTrip(CustomerReview review) {
        if (review.getBookingId() != null &&
                reviewRepository.existsByUserIdAndBookingId(review.getUserId(), review.getBookingId())) {
            throw new IllegalArgumentException("Bạn đã đánh giá cho mã đặt chỗ này.");
        }

        if (review.getTripId() != null &&
                reviewRepository.existsByUserIdAndTripId(review.getUserId(), review.getTripId())) {
            throw new IllegalArgumentException("Bạn đã đánh giá cho chuyến đi này.");
        }
    }
}

