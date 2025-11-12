package com.example.LongDistanceBus.web;

import com.example.LongDistanceBus.domain.Bus;
import com.example.LongDistanceBus.domain.Operator;
import com.example.LongDistanceBus.domain.Seat;
import com.example.LongDistanceBus.domain.SeatType;
import com.example.LongDistanceBus.repo.BusRepository;
import com.example.LongDistanceBus.repo.OperatorRepository;
import com.example.LongDistanceBus.repo.SeatRepository;
import com.example.LongDistanceBus.repo.SeatTypeRepository;
import com.example.LongDistanceBus.web.dto.BusDto;
import com.example.LongDistanceBus.web.dto.BusRequest;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/buses")
public class BusController {

    private final BusRepository buses;
    private final OperatorRepository operators;
    private final SeatTypeRepository seatTypes;
    private final SeatRepository seats;

    public BusController(BusRepository buses,
                         OperatorRepository operators,
                         SeatTypeRepository seatTypes,
                         SeatRepository seats) {
        this.buses = buses;
        this.operators = operators;
        this.seatTypes = seatTypes;
        this.seats = seats;
    }

    @GetMapping
    public List<BusDto> list(@RequestParam(required = false) Long operatorId) {
        List<Bus> busList = operatorId != null
                ? buses.findByOperator_Id(operatorId)
                : buses.findAll();
        return busList.stream().map(b -> toDto(b, false)).toList();
    }

    @GetMapping("/{id}")
    public BusDto detail(@PathVariable Long id) {
        Bus bus = findBus(id);
        return toDto(bus, true);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public BusDto create(@RequestBody @Valid BusRequest request) {
        Bus bus = new Bus();
        applyBus(request, bus);
        buses.save(bus);
        syncSeats(bus, request.seats());
        return toDto(bus, true);
    }

    @PutMapping("/{id}")
    @Transactional
    public BusDto update(@PathVariable Long id, @RequestBody @Valid BusRequest request) {
        Bus bus = findBus(id);
        applyBus(request, bus);
        buses.save(bus);
        syncSeats(bus, request.seats());
        return toDto(bus, true);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void delete(@PathVariable Long id) {
        Bus bus = findBus(id);
        seats.deleteAll(seats.findByBus_Id(bus.getId()));
        buses.delete(bus);
    }

    private void applyBus(BusRequest request, Bus bus) {
        Operator operator = operators.findById(request.operatorId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nhà xe không hợp lệ"));
        bus.setOperator(operator);
        bus.setName(request.name());
        bus.setPlate(request.plate());
        bus.setModel(request.model());
        bus.setManufacturedYear(request.manufacturedYear());
        bus.setFloorCount(request.floorCount());
        bus.setLayoutName(request.layoutName());
        bus.setAmenities(request.amenities());
        bus.setImageUrl(request.imageUrl());
    }

    private void syncSeats(Bus bus, List<BusRequest.SeatConfig> seatConfigs) {
        if (seatConfigs == null) {
            bus.setSeatCount(seats.findByBus_Id(bus.getId()).size());
            return;
        }

        List<Seat> currentSeats = seats.findByBus_Id(bus.getId());
        Map<Long, Seat> seatsById = currentSeats.stream()
                .collect(Collectors.toMap(Seat::getId, s -> s));

        Set<Long> incomingIds = seatConfigs.stream()
                .map(BusRequest.SeatConfig::id)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        // Xóa ghế không còn trong request
        currentSeats.stream()
                .filter(s -> s.getId() != null && !incomingIds.contains(s.getId()))
                .forEach(seats::delete);

        for (BusRequest.SeatConfig cfg : seatConfigs) {
            Seat seat = cfg.id() != null ? seatsById.get(cfg.id()) : null;
            if (seat == null) {
                seat = new Seat();
                seat.setBus(bus);
            }
            SeatType seatType = seatTypes.findById(cfg.seatTypeId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Loại ghế không hợp lệ"));
            seat.setSeatType(seatType);
            seat.setCode(cfg.code());
            seat.setDeckNumber(cfg.deckNumber());
            seat.setRowIndex(cfg.rowIndex());
            seat.setColumnIndex(cfg.columnIndex());
            seat.setAvailable(cfg.available() == null || cfg.available());
            seats.save(seat);
        }

        // cập nhật seat_count
        bus.setSeatCount(seats.findByBus_Id(bus.getId()).size());
    }

    private BusDto toDto(Bus bus, boolean includeSeats) {
        List<BusDto.BusSeatDto> seatDtos = includeSeats
                ? seats.findByBus_IdOrderByDeckNumberAscRowIndexAscColumnIndexAsc(bus.getId()).stream()
                .map(seat -> new BusDto.BusSeatDto(
                        seat.getId(),
                        seat.getCode(),
                        seat.getSeatType().getId(),
                        seat.getSeatType().getCode(),
                        seat.getSeatType().getName(),
                        seat.getDeckNumber(),
                        seat.getRowIndex(),
                        seat.getColumnIndex(),
                        seat.isAvailable()
                ))
                .toList()
                : List.of();

        Operator operator = bus.getOperator();
        return new BusDto(
                bus.getId(),
                operator != null ? operator.getId() : null,
                operator != null ? operator.getName() : null,
                bus.getName(),
                bus.getPlate(),
                bus.getModel(),
                bus.getManufacturedYear(),
                bus.getFloorCount(),
                bus.getSeatCount(),
                bus.getLayoutName(),
                bus.getAmenities(),
                bus.getImageUrl(),
                seatDtos
        );
    }

    private Bus findBus(Long id) {
        return buses.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Xe không tồn tại"));
    }
}

