package com.example.LongDistanceBus.web.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record BusRequest(
        @NotNull(message = "Nhà xe bắt buộc")
        Long operatorId,
        @NotBlank(message = "Tên xe bắt buộc")
        String name,
        @NotBlank(message = "Biển số bắt buộc")
        String plate,
        String model,
        Integer manufacturedYear,
        Integer floorCount,
        String layoutName,
        String amenities,
        String imageUrl,
        @Valid
        List<SeatConfig> seats
) {
    public record SeatConfig(
            Long id,
            @NotNull(message = "Loại ghế bắt buộc")
            Long seatTypeId,
            @NotBlank(message = "Mã ghế bắt buộc")
            String code,
            Integer deckNumber,
            Integer rowIndex,
            Integer columnIndex,
            Boolean available
    ) {}
}

