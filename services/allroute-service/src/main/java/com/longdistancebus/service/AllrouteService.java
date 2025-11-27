package com.longdistancebus.service;

import com.longdistancebus.domain.AllRoute;
import com.longdistancebus.repo.AllrouteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AllrouteService {
    private AllrouteRepository allrouteRepository;
    public AllrouteService(AllrouteRepository allrouteRepositoryy) {
        this.allrouteRepository = allrouteRepositoryy;
    }
    public List<AllRoute> getAllEmployees() {
        return allrouteRepository.findAll();
    }

}
