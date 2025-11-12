package com.example.LongDistanceBus.web.dto;

import java.time.LocalDateTime;

public record ReviewDto(
        Long id,
        Integer rating,
        String title,
        String content,
        String customerName,
        LocalDateTime createdAt,
        Long operatorId,
        String operatorName,
        Long busId,
        String busName,
        Long tripId,
        LocalDateTime tripDeparture,
        String source
) {}

