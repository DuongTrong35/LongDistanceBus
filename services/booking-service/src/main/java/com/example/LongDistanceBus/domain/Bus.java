package com.example.LongDistanceBus.domain;

import jakarta.persistence.*;

@Entity
@Table(
        name = "buses",
        indexes = {
                @Index(columnList = "plate", unique = true),
                @Index(columnList = "operator_id")
        }
)
public class Bus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "operator_id")
    private Operator operator;

    @Column(nullable = false, length = 80)
    private String name;

    @Column(nullable = false, length = 25)
    private String plate;

    @Column(name = "model", length = 80)
    private String model;

    @Column(name = "manufactured_year")
    private Integer manufacturedYear;

    @Column(name = "floor_count")
    private Integer floorCount;

    @Column(name = "seat_count")
    private Integer seatCount;

    @Column(name = "layout_name", length = 80)
    private String layoutName;

    @Column(name = "amenities", length = 255)
    private String amenities;

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    public Long getId() {
        return id;
    }

    public Operator getOperator() {
        return operator;
    }

    public void setOperator(Operator operator) {
        this.operator = operator;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPlate() {
        return plate;
    }

    public void setPlate(String plate) {
        this.plate = plate;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Integer getManufacturedYear() {
        return manufacturedYear;
    }

    public void setManufacturedYear(Integer manufacturedYear) {
        this.manufacturedYear = manufacturedYear;
    }

    public Integer getFloorCount() {
        return floorCount;
    }

    public void setFloorCount(Integer floorCount) {
        this.floorCount = floorCount;
    }

    public Integer getSeatCount() {
        return seatCount;
    }

    public void setSeatCount(Integer seatCount) {
        this.seatCount = seatCount;
    }

    public String getLayoutName() {
        return layoutName;
    }

    public void setLayoutName(String layoutName) {
        this.layoutName = layoutName;
    }

    public String getAmenities() {
        return amenities;
    }

    public void setAmenities(String amenities) {
        this.amenities = amenities;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
