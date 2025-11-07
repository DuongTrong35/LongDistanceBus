package com.example.LongDistanceBus.web;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173") // cho FE Vite
public class MeController {
    @GetMapping("/api/me")
    public ResponseEntity<?> me(Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("error","Unauthorized"));
        return ResponseEntity.ok(Map.of("principal", auth.getName()));
    }
}
