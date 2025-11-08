package com.example.LongDistanceBus.web;

import com.example.LongDistanceBus.domain.Trip;
import com.example.LongDistanceBus.repo.SeatRepository;
import com.example.LongDistanceBus.repo.TripRepository;
import com.example.LongDistanceBus.web.dto.TripDetailDTO;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {
    private final TripRepository trips;
    private final SeatRepository seats;

    public TripController(TripRepository trips, SeatRepository seats) {
        this.trips = trips;
        this.seats = seats;
    }

    @GetMapping("/{id}")   // => GET /api/trips/{id}
    public TripDetailDTO getTrip(@PathVariable Long id) {
        Trip t = trips.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found"));

        var bus = t.getBus();
        var seatList = seats.findByBus_Id(bus.getId());

        // TODO: thay bằng danh sách ghế đã book thực tế từ bảng ticket/booking
        List<Long> bookedSeatIds = List.of();

        var seatDTOs = seatList.stream()
                .map(s -> new TripDetailDTO.SeatDTO(
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
