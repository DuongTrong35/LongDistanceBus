package com.example.LongDistanceBus.web.dto;

import jakarta.validation.constraints.NotBlank;

public record OperatorRequest(
        @NotBlank(message = "Tên nhà xe không được bỏ trống")
        String name,
        String hotline,
        String address,
        String city,
        String email,
        String website,
        String logoUrl,
        String description
) {}

