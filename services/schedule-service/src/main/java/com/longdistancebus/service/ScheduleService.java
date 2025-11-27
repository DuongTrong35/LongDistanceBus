package com.longdistancebus.service;

import com.longdistancebus.domain.Route;
import com.longdistancebus.repo.RouteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScheduleService {
    private RouteRepository scheduleRepository;
    public ScheduleService(RouteRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    public List<Route> getAllEmployees() {
        return scheduleRepository.findAll();
    }
}
