package com.example.LongDistanceBus.web;

import com.example.LongDistanceBus.auth.AuthService;
import com.example.LongDistanceBus.auth.dto.*;
import com.example.LongDistanceBus.user.User;
import com.example.LongDistanceBus.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository users;

    @PostMapping("/register")
    public void register(@RequestBody RegisterRequest req) {
        authService.register(req);
    }

    @PostMapping("/login")
    public TokenResponse login(@RequestBody LoginRequest req) {
        return authService.login(req);
    }

    @GetMapping("/me")
    public MeResponse me(Authentication auth) {
        if (auth == null) return null;
        Long userId = Long.parseLong(String.valueOf(auth.getPrincipal()));
        User u = users.findById(userId).orElseThrow();
        return new MeResponse(u.getId(), u.getEmail(), u.getFullName(), u.getRole().name());
    }
}
