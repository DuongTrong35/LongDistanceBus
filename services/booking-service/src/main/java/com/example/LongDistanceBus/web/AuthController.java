package com.example.LongDistanceBus.web;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    // DTO tối thiểu để parse JSON
    public record LoginRequest(String email, String password) {}
    public record TokenResponse(String accessToken, Long expiresIn) {}

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest req) {
        // BỎ QUA AuthService/JWT để thử đường đi
        // Nếu request tới được đây, trả về 200 OK
        return ResponseEntity.ok(new TokenResponse("mock-token-abc", 7200L));
    }

    // (tùy) endpoint thử GET để ping nhanh
    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("auth-ok");
    }
}
