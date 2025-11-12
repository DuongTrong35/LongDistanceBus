package com.example.LongDistanceBus.web.dto;

public record FareDto(
        Long id,
        Long routeId,
        String fromStation,
        String toStation,
        Long seatTypeId,
        String seatTypeName,
        Long operatorId,
        String operatorName,
        Integer price,
        String currency,
        boolean active,
        String note
) {}

