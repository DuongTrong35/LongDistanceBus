package com.longdistancebus.review.web;

import com.longdistancebus.review.domain.CustomerReview;
import com.longdistancebus.review.service.CustomerReviewService;
import com.longdistancebus.review.web.dto.ReviewStatusUpdateRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class CustomerReviewController {
    private final CustomerReviewService customerReviewService;

    public CustomerReviewController(CustomerReviewService customerReviewService) {
        this.customerReviewService = customerReviewService;
    }

    @GetMapping
    public ResponseEntity<List<CustomerReview>> getAll() {
        return ResponseEntity.ok(customerReviewService.getAllReviews());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerReview> getById(@PathVariable Long id) {
        return customerReviewService.getReviewById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/operator/{operatorId}")
    public ResponseEntity<List<CustomerReview>> getByOperator(
            @PathVariable Long operatorId,
            @RequestParam(required = false) String status
    ) {
        return ResponseEntity.ok(customerReviewService.getReviewsForOperator(operatorId, status));
    }

    @GetMapping("/operator/{operatorId}/recent")
    public ResponseEntity<List<CustomerReview>> getRecentPublished(
            @PathVariable Long operatorId,
            @RequestParam(name = "limit", defaultValue = "10") int limit
    ) {
        return ResponseEntity.ok(customerReviewService.getRecentPublishedReviews(operatorId, limit));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CustomerReview>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(customerReviewService.getReviewsForUser(userId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<CustomerReview>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(customerReviewService.getReviewsByStatus(status));
    }

    @PostMapping
    public ResponseEntity<?> createReview(@Valid @RequestBody CustomerReview customerReview) {
        try {
            CustomerReview created = customerReviewService.createReview(customerReview);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReview(
            @PathVariable Long id,
            @Valid @RequestBody CustomerReview payload
    ) {
        try {
            CustomerReview updated = customerReviewService.updateReview(id, payload);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ReviewStatusUpdateRequest request
    ) {
        try {
            CustomerReview updated = customerReviewService.updateStatus(id, request.getStatus());
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        try {
            customerReviewService.deleteReview(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }
}


