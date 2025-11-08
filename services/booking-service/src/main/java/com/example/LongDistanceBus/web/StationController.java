package com.example.LongDistanceBus.web;

import com.example.LongDistanceBus.domain.Station;
import com.example.LongDistanceBus.repo.StationRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stations")
public class StationController {
    private final StationRepository repo;
    public StationController(StationRepository repo){ this.repo = repo; }

    @GetMapping
    public List<Station> all() { return repo.findAll(); }

    @GetMapping("/by-city")
    public List<Station> byCity(@RequestParam String city) {
        return repo.findByCityIgnoreCaseOrderByNameAsc(city);
    }
}
