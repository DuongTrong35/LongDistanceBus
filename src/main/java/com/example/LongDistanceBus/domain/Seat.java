package com.example.LongDistanceBus.domain;

import jakarta.persistence.*;
import lombok.Getter; import lombok.Setter;

@Entity @Table(name="seats")
@Getter @Setter
public class Seat {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="bus_id")
    private Bus bus;

    @Column(name="code", length=10)   // ví dụ A01, B02...
    private String code;

    @Column(name="type", length=20)   // NGỒI/ GIƯỜNG...
    private String type;
}
