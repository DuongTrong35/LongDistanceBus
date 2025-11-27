package com.longdistancebus.user.api;

import com.longdistancebus.user.api.dto.RegisterRequest;
import com.longdistancebus.user.api.dto.RegisterResponse;
import com.longdistancebus.user.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public RegisterResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);  // Gọi phương thức register từ AuthService
    }
}
