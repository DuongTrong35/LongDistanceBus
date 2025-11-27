package com.longdistancebus.operator.web;

import com.longdistancebus.operator.domain.Operator;
import com.longdistancebus.operator.service.OperatorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/operators")
public class OperatorController {
    private final OperatorService operatorService;

    public OperatorController(OperatorService operatorService) {
        this.operatorService = operatorService;
    }

    @GetMapping
    public ResponseEntity<List<Operator>> getAllOperators() {
        List<Operator> operators = operatorService.getAllOperators();
        return ResponseEntity.ok(operators);
    }

    @GetMapping("/active")
    public ResponseEntity<List<Operator>> getActiveOperators() {
        List<Operator> operators = operatorService.getActiveOperators();
        return ResponseEntity.ok(operators);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Operator> getById(@PathVariable Long id) {
        return operatorService.getOperatorById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createOperator(@Valid @RequestBody Operator newOperator) {
        try {
            Operator created = operatorService.createOperator(newOperator);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateOperator(
            @PathVariable Long id,
            @Valid @RequestBody Operator updatedOperator) {
        try {
            Operator updated = operatorService.updateOperator(id, updatedOperator);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOperator(@PathVariable Long id) {
        try {
            operatorService.deleteOperator(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Operator>> searchOperators(@RequestParam String keyword) {
        List<Operator> operators = operatorService.searchOperators(keyword);
        return ResponseEntity.ok(operators);
    }
}

