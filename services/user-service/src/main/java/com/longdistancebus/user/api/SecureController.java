package com.longdistancebus.user.api;

import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/secure")
public class SecureController {

    @GetMapping("/hello")
    public Map<String, String> hello(JwtAuthenticationToken principal) {
        String email = principal.getToken().getSubject();
        return Map.of("message", "Hello, " + email);
    }
}
