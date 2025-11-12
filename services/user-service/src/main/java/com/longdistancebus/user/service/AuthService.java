package com.longdistancebus.user.service;

import com.longdistancebus.user.api.dto.LoginRequest;
import com.longdistancebus.user.api.dto.RegisterRequest;
import com.longdistancebus.user.domain.Role;
import com.longdistancebus.user.domain.User;
import com.longdistancebus.user.repo.RoleRepository;
import com.longdistancebus.user.repo.UserRepository;
import com.longdistancebus.user.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {
    private final UserRepository users;
    private final RoleRepository roles;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository users, RoleRepository roles,
                       PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.users = users;
        this.roles = roles;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public User register(RegisterRequest req) {
        String email = req.getEmail().trim().toLowerCase();
        if (users.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered");
        }
        User u = new User();
        u.setEmail(email);
        u.setFullName(req.getFullName());
        u.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        Role userRole = roles.findByName("USER").orElseGet(() -> roles.save(new Role("USER")));
        u.getRoles().add(userRole);
        return users.save(u);
    }

    public String login(LoginRequest req) {
        String email = req.getEmail().trim().toLowerCase();
        User u = users.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        if (!passwordEncoder.matches(req.getPassword(), u.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        var roleNames = u.getRoles().stream().map(Role::getName).collect(Collectors.toList());
        return jwtService.generateAccessToken(u.getId(), u.getEmail(), roleNames);
    }
}
