package com.longdistancebus.service;
import com.longdistancebus.domain.AllRoute;
import com.longdistancebus.domain.Route;
import com.longdistancebus.domain.Trip;
import com.longdistancebus.domain.TripResponseDTO;
import com.longdistancebus.repo.AllrouteRepository;
import com.longdistancebus.repo.RouteRepository;
import com.longdistancebus.repo.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TripService {
    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private RouteRepository routeRepository;

//    public TripResponseDTO getTripMerged(String busid) {
//
//        Trip trip = tripRepository.findByBusid(busid)
//                .stream()
//                .findFirst()
//                .orElseThrow(() -> new RuntimeException("Trip not found"));
//
//
//        Route route = routeRepository.findById(trip.getRouteid())
//                .orElseThrow(() -> new RuntimeException("Route not found"));
//
//        return new TripResponseDTO(trip, route);
//    }

    public List<TripResponseDTO> getTripMergedByRoute(String routeid) {
        return tripRepository.findAllByRouteid(routeid)
                .stream()
                .map(trip -> {
                    Route route = routeRepository.findById(routeid)
                            .orElseThrow(() -> new RuntimeException("Route not found"));
                    return new TripResponseDTO(trip, route);
                })
                .toList();
    }

//    public List<TripResponseDTO> getTripMerged(String busid) {
//    return tripRepository.findAllByBusid(busid)
//            .stream()
//            .map(trip -> {
//                Route route = routeRepository.findById(trip.getRouteid())
//                        .orElseThrow(() -> new RuntimeException("Route not found"));
//                return new TripResponseDTO(trip, route);
//            })
//            .toList();
//}



    public List<Trip> getSeatsByBusid(String busid) {
        return tripRepository.findByBusid(busid);
    }
}
