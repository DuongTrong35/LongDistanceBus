package com.example.LongDistanceBus.web.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record ReviewRequest(
        @Min(1) @Max(5)
        int rating,
        String title,
        @NotBlank(message = "Nội dung đánh giá không được bỏ trống")
        String content,
        String customerName,
        Long operatorId,
        Long busId,
        Long tripId,
        String source
) {}

