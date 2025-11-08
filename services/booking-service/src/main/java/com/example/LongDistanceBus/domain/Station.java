package com.example.LongDistanceBus.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "stations", indexes = {
        @Index(columnList = "city"), @Index(columnList = "name")
})
public class Station {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;        // Bến xe Miền Tây

    @Column(nullable = false, length = 120)
    private String city;        // Ho Chi Minh

    @Column(length = 255)
    private String address;     // 395 Kinh Dương Vương...

    // getters/setters
    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}
