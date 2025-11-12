package com.example.LongDistanceBus.web;

import com.example.LongDistanceBus.domain.Fare;
import com.example.LongDistanceBus.domain.Operator;
import com.example.LongDistanceBus.domain.Route;
import com.example.LongDistanceBus.domain.SeatType;
import com.example.LongDistanceBus.repo.FareRepository;
import com.example.LongDistanceBus.repo.OperatorRepository;
import com.example.LongDistanceBus.repo.RouteRepository;
import com.example.LongDistanceBus.repo.SeatTypeRepository;
import com.example.LongDistanceBus.web.dto.FareDto;
import com.example.LongDistanceBus.web.dto.FareRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/fares")
public class FareController {

    private final FareRepository fares;
    private final RouteRepository routes;
    private final SeatTypeRepository seatTypes;
    private final OperatorRepository operators;

    public FareController(FareRepository fares,
                          RouteRepository routes,
                          SeatTypeRepository seatTypes,
                          OperatorRepository operators) {
        this.fares = fares;
        this.routes = routes;
        this.seatTypes = seatTypes;
        this.operators = operators;
    }

    @GetMapping
    public List<FareDto> list(@RequestParam(required = false) Long routeId,
                              @RequestParam(required = false) Long operatorId) {
        List<Fare> items;
        if (routeId != null && operatorId != null) {
            items = fares.findByRoute_IdAndOperator_Id(routeId, operatorId);
        } else if (routeId != null) {
            items = fares.findByRoute_Id(routeId);
        } else if (operatorId != null) {
            items = fares.findByOperator_Id(operatorId);
        } else {
            items = fares.findAll();
        }
        return items.stream().map(this::toDto).toList();
    }

    @GetMapping("/{id}")
    public FareDto detail(@PathVariable Long id) {
        return toDto(find(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FareDto create(@RequestBody @Valid FareRequest request) {
        Fare fare = new Fare();
        apply(request, fare);
        return toDto(fares.save(fare));
    }

    @PutMapping("/{id}")
    public FareDto update(@PathVariable Long id, @RequestBody @Valid FareRequest request) {
        Fare fare = find(id);
        apply(request, fare);
        return toDto(fares.save(fare));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        Fare fare = find(id);
        fares.delete(fare);
    }

    private Fare find(Long id) {
        return fares.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bảng giá không tồn tại"));
    }

    private void apply(FareRequest request, Fare target) {
        Route route = routes.findById(request.routeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tuyến đường không hợp lệ"));
        SeatType seatType = seatTypes.findById(request.seatTypeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Loại ghế không hợp lệ"));

        target.setRoute(route);
        target.setSeatType(seatType);

        Operator operator = null;
        if (request.operatorId() != null) {
            operator = operators.findById(request.operatorId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nhà xe không hợp lệ"));
        }
        target.setOperator(operator);

        target.setPrice(request.price());
        if (request.currency() != null) {
            target.setCurrency(request.currency());
        }
        if (request.active() != null) {
            target.setActive(request.active());
        }
        target.setNote(request.note());
    }

    private FareDto toDto(Fare fare) {
        Route route = fare.getRoute();
        SeatType seatType = fare.getSeatType();
        Operator operator = fare.getOperator();
        return new FareDto(
                fare.getId(),
                route.getId(),
                route.getFromStation().getName(),
                route.getToStation().getName(),
                seatType.getId(),
                seatType.getName(),
                operator != null ? operator.getId() : null,
                operator != null ? operator.getName() : null,
                fare.getPrice(),
                fare.getCurrency(),
                fare.isActive(),
                fare.getNote()
        );
    }
}

