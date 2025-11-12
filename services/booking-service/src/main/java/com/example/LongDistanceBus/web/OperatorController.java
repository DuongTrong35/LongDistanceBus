package com.example.LongDistanceBus.web;

import com.example.LongDistanceBus.domain.Operator;
import com.example.LongDistanceBus.repo.OperatorRepository;
import com.example.LongDistanceBus.web.dto.OperatorDto;
import com.example.LongDistanceBus.web.dto.OperatorRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/operators")
public class OperatorController {

    private final OperatorRepository operators;

    public OperatorController(OperatorRepository operators) {
        this.operators = operators;
    }

    @GetMapping
    public List<OperatorDto> list() {
        return operators.findAll().stream().map(this::toDto).toList();
    }

    @GetMapping("/{id}")
    public OperatorDto detail(@PathVariable Long id) {
        return toDto(findOrThrow(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OperatorDto create(@RequestBody @Valid OperatorRequest request) {
        Operator op = new Operator();
        apply(request, op);
        return toDto(operators.save(op));
    }

    @PutMapping("/{id}")
    public OperatorDto update(@PathVariable Long id, @RequestBody @Valid OperatorRequest request) {
        Operator op = findOrThrow(id);
        apply(request, op);
        return toDto(operators.save(op));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        Operator op = findOrThrow(id);
        operators.delete(op);
    }

    private Operator findOrThrow(Long id) {
        return operators.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nhà xe không tồn tại"));
    }

    private void apply(OperatorRequest request, Operator target) {
        target.setName(request.name());
        target.setHotline(request.hotline());
        target.setAddress(request.address());
        target.setCity(request.city());
        target.setEmail(request.email());
        target.setWebsite(request.website());
        target.setLogoUrl(request.logoUrl());
        target.setDescription(request.description());
    }

    private OperatorDto toDto(Operator op) {
        return new OperatorDto(
                op.getId(),
                op.getName(),
                op.getHotline(),
                op.getAddress(),
                op.getCity(),
                op.getEmail(),
                op.getWebsite(),
                op.getLogoUrl(),
                op.getDescription(),
                op.getAverageRating(),
                op.getReviewCount()
        );
    }
}

