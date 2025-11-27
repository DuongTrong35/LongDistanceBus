package com.longdistancebus.web;
import com.longdistancebus.domain.Trip;
import com.longdistancebus.domain.TripResponseDTO;
import com.longdistancebus.service.TripService;
import org.springframework.web.bind.annotation.*;
        import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trip")
@CrossOrigin(origins = "*")
public class TripController {
    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

//    @GetMapping("/route/{busid}")
//    public Map<String, Object> getTripMerged(@PathVariable String busid) {
//        TripResponseDTO dto = tripService.getTripMerged(busid);
//        return Map.of("trip", dto);
//    }
@GetMapping("/route/{busid}")
public Map<String, Object> getTripMerged(@PathVariable String busid) {
    List<TripResponseDTO> dtoList = tripService.getTripMerged(busid);
    return Map.of("trip", dtoList);
}

}
