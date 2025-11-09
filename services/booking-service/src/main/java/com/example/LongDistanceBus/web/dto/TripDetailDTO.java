package com.example.LongDistanceBus.web.dto;

import java.time.LocalDateTime;
import java.util.List;

public record TripDetailDTO(
        Long id,
        String fromName,
        String toName,
        LocalDateTime departureTime,
        LocalDateTime arrivalTime,
        String busName,
        String plate,
        List<TripDetailDTO.SeatDTO> seats
) {
    public static record SeatDTO(
            Long id, String code, String type, boolean booked
    ) {}
}
