package com.example.LongDistanceBus.web.dto;

import jakarta.validation.constraints.NotBlank;

public record SeatTypeRequest(
        @NotBlank(message = "Mã loại ghế bắt buộc")
        String code,
        @NotBlank(message = "Tên loại ghế bắt buộc")
        String name,
        String description,
        Integer basePrice
) {}

