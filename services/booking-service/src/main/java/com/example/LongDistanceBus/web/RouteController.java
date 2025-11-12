package com.example.LongDistanceBus.web;

import com.example.LongDistanceBus.domain.Route;
import com.example.LongDistanceBus.repo.RouteRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
public class RouteController {

    private final RouteRepository routes;

    public RouteController(RouteRepository routes) {
        this.routes = routes;
    }

    @GetMapping
    public List<Route> list() {
        return routes.findAll();
    }
}

