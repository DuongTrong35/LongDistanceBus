package com.example.LongDistanceBus.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(cs -> cs.disable())
                .formLogin(f -> f.disable())
                .httpBasic(b -> b.disable())
                .authorizeHttpRequests(auth -> auth
                        // Cho phép preflight
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Public cho auth
                        .requestMatchers("/api/v1/auth/**").permitAll()

                        // (Tuỳ bạn) Nếu cần public tra cứu tuyến/bến:
                        // .requestMatchers(HttpMethod.GET, "/api/stations/**").permitAll()
                        // .requestMatchers(HttpMethod.GET, "/api/trips/**").permitAll()

                        // Mặc định: các API khác yêu cầu JWT
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // CORS cho FE dev (Vite)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration c = new CorsConfiguration();
        c.setAllowedOrigins(List.of("http://localhost:5173"));
        c.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        c.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        c.setExposedHeaders(List.of("Authorization"));
        c.setAllowCredentials(false); // không dùng cookie

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", c);
        return source;
    }
}
