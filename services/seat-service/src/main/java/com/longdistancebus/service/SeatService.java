package com.longdistancebus.service;

import com.longdistancebus.domain.Seat;
import com.longdistancebus.repo.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SeatService {
    @Autowired
    private SeatRepository seatRepository;
    public List<Seat> getSeatsByBusid(String busid) {
        return seatRepository.findByBusid(busid);
    }
}
