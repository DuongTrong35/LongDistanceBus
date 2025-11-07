package com.example.LongDistanceBus.domain;

import jakarta.persistence.*;

@Entity
@Table(name="buses", indexes = @Index(columnList = "plate", unique = true))
public class Bus {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, length=50)
    private String name;          // Ví dụ: "Giường nằm 40 chỗ"

    @Column(nullable=false, length=25)
    private String plate;         // biển số

    @Column(name="seat_count")    // tổng số ghế (đơn giản hoá, chi tiết sơ đồ thêm sau)
    private Integer seatCount;

    public Long getId(){ return id; }
    public String getName(){ return name; }
    public void setName(String n){ this.name = n; }
    public String getPlate(){ return plate; }
    public void setPlate(String p){ this.plate = p; }
    public Integer getSeatCount(){ return seatCount; }
    public void setSeatCount(Integer c){ this.seatCount = c; }
}
