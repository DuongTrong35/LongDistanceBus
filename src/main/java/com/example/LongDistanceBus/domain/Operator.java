package com.example.LongDistanceBus.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "operators")
public class Operator {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120, unique = true)
    private String name;

    @Column(length = 30)
    private String hotline;

    // getters/setters
    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getHotline() { return hotline; }
    public void setHotline(String hotline) { this.hotline = hotline; }
}
