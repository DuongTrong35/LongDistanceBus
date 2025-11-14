package com.longdistancebus.web;

import com.longdistancebus.domain.Seat;
import com.longdistancebus.service.SeatService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
@CrossOrigin(origins = "*") // Cho phép React gọi API này
public class SeatController {
    private final SeatService seatService;

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

//    // Lấy ghế theo ID
//    @GetMapping("/{id}")
//    public Seat getById(@PathVariable String id) {
//        return seatService.getEmployeeById(id).orElse(null);
//    }

    // ✅ Lấy danh sách ghế theo busid (ví dụ: PTHCMX1)
    @GetMapping("/bus/{busid}")
    public List<Seat> getByBusid(@PathVariable String busid) {
        return seatService.getSeatsByBusid(busid);
    }
}
