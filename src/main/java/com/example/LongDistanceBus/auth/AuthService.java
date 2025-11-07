package com.example.LongDistanceBus.auth;

import com.example.LongDistanceBus.auth.dto.AuthResponse;
import com.example.LongDistanceBus.auth.dto.LoginRequest;
import com.example.LongDistanceBus.auth.dto.RegisterRequest;
import com.example.LongDistanceBus.domain.User;
import com.example.LongDistanceBus.repo.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.LongDistanceBus.security.JwtService;
import java.util.Map;

@Service
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthService(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    public AuthResponse register(RegisterRequest req) {
        users.findByEmail(req.getEmail()).ifPresent(u -> {
            throw new RuntimeException("Email already exists");
        });
        if (req.getPhone() != null && !req.getPhone().isBlank()) {
            users.findByPhone(req.getPhone()).ifPresent(u -> {
                throw new RuntimeException("Phone already exists");
            });
        }

        User u = new User();
        u.setFullName(req.getFullName());
        u.setEmail(req.getEmail());
        u.setPhone(req.getPhone());
        u.setPasswordHash(encoder.encode(req.getPassword())); // mã hoá BCrypt
        users.save(u);

        String token = jwt.generate(
                u.getEmail(),
                Map.of("uid", u.getId(), "role", u.getRole())
        );
        return new AuthResponse(token, u.getFullName());

    }
    public AuthResponse login(LoginRequest req) {
        var opt = req.getEmailOrPhone().contains("@")
                ? users.findByEmail(req.getEmailOrPhone())
                : users.findByPhone(req.getEmailOrPhone());

        var u = opt.orElseThrow(() -> new RuntimeException("User not found"));
        if (!encoder.matches(req.getPassword(), u.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }
        String token = jwt.generate(
                u.getEmail(),
                Map.of("uid", u.getId(), "role", u.getRole())
        );
        return new AuthResponse(token, u.getFullName());
    }
}
