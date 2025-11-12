package com.example.LongDistanceBus.web.dto;

public record OperatorDto(
        Long id,
        String name,
        String hotline,
        String address,
        String city,
        String email,
        String website,
        String logoUrl,
        String description,
        Double averageRating,
        Integer reviewCount
) {}

