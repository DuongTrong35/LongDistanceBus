package com.example.LongDistanceBus.web;

import com.example.LongDistanceBus.domain.SeatType;
import com.example.LongDistanceBus.repo.SeatTypeRepository;
import com.example.LongDistanceBus.web.dto.SeatTypeDto;
import com.example.LongDistanceBus.web.dto.SeatTypeRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/seat-types")
public class SeatTypeController {

    private final SeatTypeRepository seatTypes;

    public SeatTypeController(SeatTypeRepository seatTypes) {
        this.seatTypes = seatTypes;
    }

    @GetMapping
    public List<SeatTypeDto> list() {
        return seatTypes.findAll().stream().map(this::toDto).toList();
    }

    @GetMapping("/{id}")
    public SeatTypeDto detail(@PathVariable Long id) {
        return toDto(find(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SeatTypeDto create(@RequestBody @Valid SeatTypeRequest request) {
        SeatType st = new SeatType();
        apply(request, st);
        return toDto(seatTypes.save(st));
    }

    @PutMapping("/{id}")
    public SeatTypeDto update(@PathVariable Long id, @RequestBody @Valid SeatTypeRequest request) {
        SeatType st = find(id);
        apply(request, st);
        return toDto(seatTypes.save(st));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        SeatType st = find(id);
        seatTypes.delete(st);
    }

    private SeatType find(Long id) {
        return seatTypes.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loại ghế không tồn tại"));
    }

    private void apply(SeatTypeRequest request, SeatType seatType) {
        seatType.setCode(request.code());
        seatType.setName(request.name());
        seatType.setDescription(request.description());
        seatType.setBasePrice(request.basePrice());
    }

    private SeatTypeDto toDto(SeatType seatType) {
        return new SeatTypeDto(
                seatType.getId(),
                seatType.getCode(),
                seatType.getName(),
                seatType.getDescription(),
                seatType.getBasePrice()
        );
    }
}

