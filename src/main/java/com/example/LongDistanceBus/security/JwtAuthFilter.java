package com.example.LongDistanceBus.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Filter đọc Authorization: Bearer <token>,
 * dùng JwtService để validate và set Authentication vào SecurityContext.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        // Bỏ qua đường dẫn auth/public để không cần JWT
        String path = request.getRequestURI();
        if (path.startsWith("/api/v1/auth") || "OPTIONS".equalsIgnoreCase(request.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                String subject = jwtService.extractUsername(token); // thường là email
                if (subject != null && jwtService.isValid(token)) {
                    // Ở mức tối thiểu, không cần load UserDetails:
                    var auth = new UsernamePasswordAuthenticationToken(subject, null, java.util.List.of());
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            } catch (Exception ex) {
                // Token hỏng/het hạn -> để rơi xuống 401/403 ở layer sau
                // (không throw, để controller advice/entrypoint xử lý)
            }
        }

        chain.doFilter(request, response);
    }
}
