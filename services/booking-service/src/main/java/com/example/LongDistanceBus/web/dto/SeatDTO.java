package com.example.LongDistanceBus.web.dto;

public class SeatDTO {
    private Long id;
    private String code;
    private String type;   // nếu Seat.type là enum -> map sang String ở controller
    private boolean booked;

    public SeatDTO() {}

    public SeatDTO(Long id, String code, String type, boolean booked) {
        this.id = id;
        this.code = code;
        this.type = type;
        this.booked = booked;
    }

    public Long getId() { return id; }
    public String getCode() { return code; }
    public String getType() { return type; }
    public boolean isBooked() { return booked; }

    public void setId(Long id) { this.id = id; }
    public void setCode(String code) { this.code = code; }
    public void setType(String type) { this.type = type; }
    public void setBooked(boolean booked) { this.booked = booked; }
}
