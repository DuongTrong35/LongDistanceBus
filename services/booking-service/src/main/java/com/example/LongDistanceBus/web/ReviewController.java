package com.example.LongDistanceBus.web;

import com.example.LongDistanceBus.domain.*;
import com.example.LongDistanceBus.repo.*;
import com.example.LongDistanceBus.web.dto.ReviewDto;
import com.example.LongDistanceBus.web.dto.ReviewRequest;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewRepository reviews;
    private final OperatorRepository operators;
    private final BusRepository buses;
    private final TripRepository trips;

    public ReviewController(ReviewRepository reviews,
                            OperatorRepository operators,
                            BusRepository buses,
                            TripRepository trips) {
        this.reviews = reviews;
        this.operators = operators;
        this.buses = buses;
        this.trips = trips;
    }

    @GetMapping
    public List<ReviewDto> list(@RequestParam(required = false) Long operatorId,
                                @RequestParam(required = false) Long busId,
                                @RequestParam(required = false) Long tripId) {
        List<Review> items;
        if (operatorId != null) {
            items = reviews.findByOperator_Id(operatorId);
        } else if (busId != null) {
            items = reviews.findByBus_Id(busId);
        } else if (tripId != null) {
            items = reviews.findByTrip_Id(tripId);
        } else {
            items = reviews.findAll();
        }
        return items.stream().map(this::toDto).toList();
    }

    @GetMapping("/{id}")
    public ReviewDto detail(@PathVariable Long id) {
        return toDto(find(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public ReviewDto create(@RequestBody @Valid ReviewRequest request) {
        Review review = new Review();
        apply(request, review);
        review.setCreatedAt(LocalDateTime.now());
        Review saved = reviews.save(review);
        updateOperatorStats(saved.getOperator());
        return toDto(saved);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void delete(@PathVariable Long id) {
        Review review = find(id);
        Operator operator = review.getOperator();
        reviews.delete(review);
        updateOperatorStats(operator);
    }

    private Review find(Long id) {
        return reviews.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Đánh giá không tồn tại"));
    }

    private void apply(ReviewRequest request, Review review) {
        review.setRating(request.rating());
        review.setTitle(request.title());
        review.setContent(request.content());
        review.setCustomerName(request.customerName());
        review.setSource(request.source());

        if (request.operatorId() != null) {
            Operator operator = operators.findById(request.operatorId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nhà xe không hợp lệ"));
            review.setOperator(operator);
        }
        if (request.busId() != null) {
            Bus bus = buses.findById(request.busId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Xe không hợp lệ"));
            review.setBus(bus);
        }
        if (request.tripId() != null) {
            Trip trip = trips.findById(request.tripId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chuyến đi không hợp lệ"));
            review.setTrip(trip);
            if (review.getBus() == null) {
                review.setBus(trip.getBus());
            }
            if (review.getOperator() == null) {
                review.setOperator(trip.getBus().getOperator());
            }
        }

        if (review.getOperator() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Đánh giá phải gắn với nhà xe");
        }
    }

    private void updateOperatorStats(Operator operator) {
        if (operator == null || operator.getId() == null) return;
        List<Review> operatorReviews = reviews.findByOperator_Id(operator.getId());
        if (operatorReviews.isEmpty()) {
            operator.setAverageRating(null);
            operator.setReviewCount(0);
        } else {
            double avg = operatorReviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);
            operator.setAverageRating(Math.round(avg * 10.0) / 10.0);
            operator.setReviewCount(operatorReviews.size());
        }
        operators.save(operator);
    }

    private ReviewDto toDto(Review review) {
        Operator operator = review.getOperator();
        Bus bus = review.getBus();
        Trip trip = review.getTrip();
        return new ReviewDto(
                review.getId(),
                review.getRating(),
                review.getTitle(),
                review.getContent(),
                review.getCustomerName(),
                review.getCreatedAt(),
                operator != null ? operator.getId() : null,
                operator != null ? operator.getName() : null,
                bus != null ? bus.getId() : null,
                bus != null ? bus.getName() : null,
                trip != null ? trip.getId() : null,
                trip != null ? trip.getDepartureTime() : null,
                review.getSource()
        );
    }
}

