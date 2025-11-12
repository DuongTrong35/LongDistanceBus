package com.example.LongDistanceBus.web.dto;

public record SeatTypeDto(
        Long id,
        String code,
        String name,
        String description,
        Integer basePrice
) {}

