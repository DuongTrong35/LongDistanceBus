package com.example.LongDistanceBus.web;

import com.example.LongDistanceBus.domain.Trip;
import com.example.LongDistanceBus.repo.SeatRepository;
import com.example.LongDistanceBus.repo.TripRepository;
import com.example.LongDistanceBus.web.dto.TripDetailDTO; // <-- chỉ import TripDetailDTO
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = "http://localhost:5173") // cho FE Vite
public class TripController {
    private final TripRepository trips;
    private final SeatRepository seats;

    public TripController(TripRepository trips, SeatRepository seats) {
        this.trips = trips;
        this.seats = seats;
    }

    @GetMapping("/{id}")
    public TripDetailDTO getTrip(@PathVariable Long id) {
        Trip t = trips.findById(id).orElseThrow();
        var bus = t.getBus();

        // lấy toàn bộ ghế của bus
        var seatList = seats.findByBus_Id(bus.getId());

        // TODO: thay bằng danh sách ghế đã book thực tế từ bảng ticket/booking
        List<Long> bookedSeatIds = List.of();

        var seatDTOs = seatList.stream()
                .map(s -> new TripDetailDTO.SeatDTO(   // <-- dùng lớp lồng
                        s.getId(),
                        s.getCode(),
                        s.getType(),
                        bookedSeatIds.contains(s.getId())
                ))
                .toList();

        return new TripDetailDTO(
                t.getId(),
                t.getRoute().getFromStation().getName(),
                t.getRoute().getToStation().getName(),
                t.getDepartureTime(),
                t.getArrivalTime(),
                bus.getName(),
                bus.getPlate(),
                seatDTOs
        );
    }
}
