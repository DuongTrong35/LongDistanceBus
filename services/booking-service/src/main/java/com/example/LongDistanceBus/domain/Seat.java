package com.example.LongDistanceBus.domain;

import jakarta.persistence.*;

@Entity
@Table(
        name = "seats",
        uniqueConstraints = @UniqueConstraint(columnNames = {"bus_id", "code"}),
        indexes = {
                @Index(columnList = "bus_id"),
                @Index(columnList = "seat_type_id")
        }
)
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "bus_id")
    private Bus bus;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_type_id")
    private SeatType seatType;

    @Column(nullable = false, length = 10)
    private String code;

    @Column(name = "row_index")
    private Integer rowIndex;

    @Column(name = "column_index")
    private Integer columnIndex;

    @Column(name = "deck_number")
    private Integer deckNumber;

    @Column(name = "available", nullable = false)
    private boolean available = true;

    public Long getId() {
        return id;
    }

    public Bus getBus() {
        return bus;
    }

    public void setBus(Bus bus) {
        this.bus = bus;
    }

    public SeatType getSeatType() {
        return seatType;
    }

    public void setSeatType(SeatType seatType) {
        this.seatType = seatType;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Integer getRowIndex() {
        return rowIndex;
    }

    public void setRowIndex(Integer rowIndex) {
        this.rowIndex = rowIndex;
    }

    public Integer getColumnIndex() {
        return columnIndex;
    }

    public void setColumnIndex(Integer columnIndex) {
        this.columnIndex = columnIndex;
    }

    public Integer getDeckNumber() {
        return deckNumber;
    }

    public void setDeckNumber(Integer deckNumber) {
        this.deckNumber = deckNumber;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }
}
