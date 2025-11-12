package com.example.LongDistanceBus.web.dto;

import java.time.LocalDateTime;
import java.util.List;

public class TripDetailDTO {
    private Long tripId;
    private String fromStationName;
    private String toStationName;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private String busName;
    private String busPlate;
    private List<SeatDTO> seats;

    public TripDetailDTO() {}

    public TripDetailDTO(Long tripId,
                         String fromStationName,
                         String toStationName,
                         LocalDateTime departureTime,
                         LocalDateTime arrivalTime,
                         String busName,
                         String busPlate,
                         List<SeatDTO> seats) {
        this.tripId = tripId;
        this.fromStationName = fromStationName;
        this.toStationName = toStationName;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.busName = busName;
        this.busPlate = busPlate;
        this.seats = seats;
    }

    public Long getTripId() { return tripId; }
    public String getFromStationName() { return fromStationName; }
    public String getToStationName() { return toStationName; }
    public LocalDateTime getDepartureTime() { return departureTime; }
    public LocalDateTime getArrivalTime() { return arrivalTime; }
    public String getBusName() { return busName; }
    public String getBusPlate() { return busPlate; }
    public List<SeatDTO> getSeats() { return seats; }

    public void setTripId(Long tripId) { this.tripId = tripId; }
    public void setFromStationName(String fromStationName) { this.fromStationName = fromStationName; }
    public void setToStationName(String toStationName) { this.toStationName = toStationName; }
    public void setDepartureTime(LocalDateTime departureTime) { this.departureTime = departureTime; }
    public void setArrivalTime(LocalDateTime arrivalTime) { this.arrivalTime = arrivalTime; }
    public void setBusName(String busName) { this.busName = busName; }
    public void setBusPlate(String busPlate) { this.busPlate = busPlate; }
    public void setSeats(List<SeatDTO> seats) { this.seats = seats; }
}
