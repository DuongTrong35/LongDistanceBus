package com.example.LongDistanceBus.web.dto;

import java.util.List;

public record BusDto(
        Long id,
        Long operatorId,
        String operatorName,
        String name,
        String plate,
        String model,
        Integer manufacturedYear,
        Integer floorCount,
        Integer seatCount,
        String layoutName,
        String amenities,
        String imageUrl,
        List<BusSeatDto> seats
) {
    public record BusSeatDto(
            Long id,
            String code,
            Long seatTypeId,
            String seatTypeCode,
            String seatTypeName,
            Integer deckNumber,
            Integer rowIndex,
            Integer columnIndex,
            Boolean available
    ) {}
}

