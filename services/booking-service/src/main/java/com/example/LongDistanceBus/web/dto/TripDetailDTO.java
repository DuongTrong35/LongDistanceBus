package com.example.LongDistanceBus.web.dto;

import java.time.LocalDateTime;
import java.util.List;

public record TripDetailDTO(
        Long id,
        String fromName,
        String toName,
        LocalDateTime departureTime,
        LocalDateTime arrivalTime,
        String operatorName,
        String busName,
        String busPlate,
        List<TripDetailDTO.SeatDTO> seats
) {
    public static record SeatDTO(
            Long id,
            String code,
            SeatTypeDTO seatType,
            boolean booked,
            Integer price,
            Integer deck,
            Integer row,
            Integer column
    ) {}

    public static record SeatTypeDTO(
            Long id,
            String code,
            String name
    ) {}
}
