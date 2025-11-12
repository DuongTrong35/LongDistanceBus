package com.example.LongDistanceBus.web;

import com.example.LongDistanceBus.domain.Trip;
import com.example.LongDistanceBus.domain.Seat;
import com.example.LongDistanceBus.repo.FareRepository;
import com.example.LongDistanceBus.repo.TripRepository;
import com.example.LongDistanceBus.repo.SeatRepository;
import com.example.LongDistanceBus.web.dto.TripDetailDTO;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/trips")
public class TripController {
    private final TripRepository trips;
    private final SeatRepository seats;
    private final FareRepository fares;

    public TripController(TripRepository trips, SeatRepository seats, FareRepository fares) {
        this.trips = trips;
        this.seats = seats;
        this.fares = fares;
    }

    @GetMapping("/search")
    public List<Trip> search(
            @RequestParam(name = "fromId") Long fromStationId,
            @RequestParam(name = "toId") Long toStationId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        LocalDate searchDate = date != null ? date : LocalDate.now();
        LocalDateTime start = searchDate.atStartOfDay();
        LocalDateTime end   = start.plusDays(1);
        return trips.findByRoute_FromStation_IdAndRoute_ToStation_IdAndDepartureTimeBetween(
                fromStationId, toStationId, start, end
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
        var seatList = seats.findByBus_IdOrderByDeckNumberAscRowIndexAscColumnIndexAsc(bus.getId());

        Long operatorId = Optional.ofNullable(bus.getOperator()).map(o -> o.getId()).orElse(null);

        Map<Long, Integer> priceBySeatType = faresForTrip(t.getRoute().getId(), operatorId);

        // TODO: thay bằng danh sách ghế đã book thực tế từ bảng ticket/booking
        List<Long> bookedSeatIds = List.of();

        var seatDTOs = seatList.stream()
                .sorted(Comparator
                        .comparing(Seat::getDeckNumber, Comparator.nullsLast(Integer::compareTo))
                        .thenComparing(Seat::getRowIndex, Comparator.nullsLast(Integer::compareTo))
                        .thenComparing(Seat::getColumnIndex, Comparator.nullsLast(Integer::compareTo))
                        .thenComparing(Seat::getCode))
                .map(s -> new TripDetailDTO.SeatDTO(
                        s.getId(),
                        s.getCode(),
                        new TripDetailDTO.SeatTypeDTO(
                                s.getSeatType().getId(),
                                s.getSeatType().getCode(),
                                s.getSeatType().getName()
                        ),
                        bookedSeatIds.contains(s.getId()),
                        priceBySeatType.getOrDefault(s.getSeatType().getId(), s.getSeatType().getBasePrice()),
                        s.getDeckNumber(),
                        s.getRowIndex(),
                        s.getColumnIndex()
                ))
                .toList();

        return new TripDetailDTO(
                t.getId(),
                t.getRoute().getFromStation().getName(),
                t.getRoute().getToStation().getName(),
                t.getDepartureTime(),
                t.getArrivalTime(),
                bus.getOperator() != null ? bus.getOperator().getName() : null,
                bus.getName(),
                bus.getPlate(),
                seatDTOs
        );
    }

    private Map<Long, Integer> faresForTrip(Long routeId, Long operatorId) {
        List<com.example.LongDistanceBus.domain.Fare> fareList;
        if (operatorId != null) {
            fareList = fares.findByRoute_IdAndOperator_Id(routeId, operatorId);
            if (fareList.isEmpty()) {
                fareList = fares.findByRoute_Id(routeId);
            }
        } else {
            fareList = fares.findByRoute_Id(routeId);
        }

        return fareList.stream()
                .filter(com.example.LongDistanceBus.domain.Fare::isActive)
                .collect(Collectors.toMap(
                        f -> f.getSeatType().getId(),
                        com.example.LongDistanceBus.domain.Fare::getPrice,
                        (existing, replacement) -> replacement
                ));
    }
}
