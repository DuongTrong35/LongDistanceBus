package com.example.LongDistanceBus.web.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record FareRequest(
        @NotNull(message = "Tuyến đường bắt buộc")
        Long routeId,
        @NotNull(message = "Loại ghế bắt buộc")
        Long seatTypeId,
        Long operatorId,
        @Min(value = 0, message = "Giá phải không âm")
        Integer price,
        String currency,
        Boolean active,
        String note
) {}

