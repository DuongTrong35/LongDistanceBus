package com.example.LongDistanceBus.web;

import com.example.LongDistanceBus.domain.Trip;
import com.example.LongDistanceBus.repo.SeatRepository;
import com.example.LongDistanceBus.repo.TripRepository;
import com.example.LongDistanceBus.web.dto.TripDetailDTO;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
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

    @GetMapping("/search")
    public List<Trip> search(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        LocalDateTime start = (date != null ? date : LocalDate.now()).atStartOfDay();
        LocalDateTime end   = start.plusDays(1);
        return trips.findByRoute_FromStation_NameAndRoute_ToStation_NameAndDepartureTimeBetween(
                from, to, start, end
        );
    }


    @GetMapping
    public List<Trip> listTrips() {
        return trips.findAll();
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
