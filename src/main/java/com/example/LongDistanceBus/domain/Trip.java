package com.example.LongDistanceBus.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity @Table(name="trips")
public class Trip {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional=false) @JoinColumn(name="route_id")
    private Route route;

    @ManyToOne(optional=false) @JoinColumn(name="bus_id")
    private Bus bus;

    @Column(name="departure_time", nullable=false)
    private LocalDateTime departureTime;

    @Column(name="arrival_time", nullable=false)
    private LocalDateTime arrivalTime;

    private Integer price;

    @Column(name="seats_total")  private Integer seatsTotal;
    @Column(name="seats_booked") private Integer seatsBooked;

    // getters/setters
    public Long getId() { return id; }
    public Route getRoute() { return route; }
    public void setRoute(Route r) { this.route = r; }
    public Bus getBus() { return bus; }
    public void setBus(Bus b) { this.bus = b; }
    public LocalDateTime getDepartureTime() { return departureTime; }
    public void setDepartureTime(LocalDateTime t) { this.departureTime = t; }
    public LocalDateTime getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(LocalDateTime t) { this.arrivalTime = t; }
    public Integer getPrice() { return price; }
    public void setPrice(Integer p) { this.price = p; }
    public Integer getSeatsTotal() { return seatsTotal; }
    public void setSeatsTotal(Integer s) { this.seatsTotal = s; }
    public Integer getSeatsBooked() { return seatsBooked; }
    public void setSeatsBooked(Integer s) { this.seatsBooked = s; }
}
