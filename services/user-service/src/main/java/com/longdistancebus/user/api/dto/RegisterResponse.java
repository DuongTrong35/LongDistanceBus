package com.longdistancebus.user.api.dto;

import java.time.Instant;
import java.util.List;

public class RegisterResponse {
    private Long id;
    private String email;
    private String fullName;
    private String status;
    private Instant createdAt;
    private List<String> roles;

    public RegisterResponse() {}

    public RegisterResponse(Long id, String email, String fullName, String status, Instant createdAt, List<String> roles) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.status = status;
        this.createdAt = createdAt;
        this.roles = roles;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}


