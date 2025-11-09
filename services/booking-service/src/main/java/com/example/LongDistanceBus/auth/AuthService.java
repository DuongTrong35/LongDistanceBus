package com.example.LongDistanceBus.auth;

import com.example.LongDistanceBus.auth.dto.*;
import com.example.LongDistanceBus.security.JwtService;
import com.example.LongDistanceBus.user.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwt;

    public void register(RegisterRequest req) {
        if (users.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        User u = User.builder()
                .email(req.getEmail())
                .fullName(req.getFullName())
                .role(Role.USER)
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .build();
        users.save(u);
    }

    public TokenResponse login(LoginRequest req) {
        User u = users.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(req.getPassword(), u.getPasswordHash())) {
            throw new RuntimeException("Bad credentials");
        }

        // ✅ chỉ truyền userId
        String token = jwt.generate(u.getId());
        return new TokenResponse(token);
    }
}