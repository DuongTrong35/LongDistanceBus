package com.longdistancebus.web;

import com.longdistancebus.domain.Route;
import com.longdistancebus.service.ScheduleService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@CrossOrigin("*")
@RestController
@RequestMapping("/api/schedule")
public class ScheduleController {
    private ScheduleService scheduleService;
    public ScheduleController(ScheduleService scheduleServicee) {
        this.scheduleService = scheduleServicee;
    }
    @GetMapping
    public List<Route> getAllEmployees() {
        return scheduleService.getAllEmployees();
    }
}
