package com.example.LongDistanceBus.web;

import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProfileController {

    @GetMapping("/profile")
    public ProfileResponse profile(JwtAuthenticationToken authenticationToken) {
        var jwt = authenticationToken.getToken();
        Long userId = jwt.getClaim("user_id");
        String email = jwt.getSubject();
        List<String> roles = jwt.getClaim("roles");
        return new ProfileResponse(userId, email, roles);
    }

    public record ProfileResponse(Long userId, String email, List<String> roles) { }
}
