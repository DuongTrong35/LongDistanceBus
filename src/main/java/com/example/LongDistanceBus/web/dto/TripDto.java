package com.example.LongDistanceBus.web.dto;

import java.time.LocalDateTime;

public class TripDto {
    public Long id;

    public String fromName;
    public String toName;
    public LocalDateTime departureTime;
    public LocalDateTime arrivalTime;
    public Integer price;
    public Integer seatsLeft;
    public String busName;
    public String plate;

    public TripDto(Long id, String fromName, String toName,
                   LocalDateTime departureTime, LocalDateTime arrivalTime,
                   Integer price, Integer seatsLeft, String busName, String plate) {
        this.id = id; this.fromName = fromName; this.toName = toName;
        this.departureTime = departureTime; this.arrivalTime = arrivalTime;
        this.price = price; this.seatsLeft = seatsLeft;
        this.busName = busName; this.plate = plate;
    }
}
