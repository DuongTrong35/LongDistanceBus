package com.longdistancebus.web;

import com.longdistancebus.domain.AllRoute;
import com.longdistancebus.service.AllrouteService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/allroute")
public class AllrouteController {
    private final AllrouteService allrouteService;
    public AllrouteController(AllrouteService allrouteeService) {
        this.allrouteService = allrouteeService;
    }

    @GetMapping
    public List<AllRoute> getAllEmployees() {
        return allrouteService.getAllEmployees();
    }


}
