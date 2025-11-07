package com.example.LongDistanceBus.domain;

import jakarta.persistence.*;

@Entity @Table(name="routes")
public class Route {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional=false) @JoinColumn(name="from_station_id")
    private Station fromStation;

    @ManyToOne(optional=false) @JoinColumn(name="to_station_id")
    private Station toStation;

    @Column(name="distance_km")
    private Integer distanceKm;

    // getters/setters
    public Long getId() { return id; }
    public Station getFromStation() { return fromStation; }
    public void setFromStation(Station s) { this.fromStation = s; }
    public Station getToStation() { return toStation; }
    public void setToStation(Station s) { this.toStation = s; }
    public Integer getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Integer d) { this.distanceKm = d; }
}
