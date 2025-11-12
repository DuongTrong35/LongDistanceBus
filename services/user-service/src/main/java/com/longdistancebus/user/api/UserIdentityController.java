package com.longdistancebus.user.api;

import com.longdistancebus.user.api.dto.RegisterResponse;
import com.longdistancebus.user.domain.Role;
import com.longdistancebus.user.domain.User;
import com.longdistancebus.user.repo.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping({"/auth", "/api/auth"})
public class UserIdentityController {

    private final UserRepository users;

    public UserIdentityController(UserRepository users) {
        this.users = users;
    }

    @GetMapping("/me")
    public RegisterResponse me(Authentication authentication) {
        if (!(authentication instanceof JwtAuthenticationToken token)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        String email = token.getToken().getSubject();
        User user = users.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        List<String> roles = user.getRoles().stream().map(Role::getName).toList();
        return new RegisterResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getStatus(),
                user.getCreatedAt(),
                roles
        );
    }
}
