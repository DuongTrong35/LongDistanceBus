package com.longdistancebus.user.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
    @Email @NotBlank
    private String email;

    @NotBlank @Size(min = 6, max = 100)
    private String password;

    @NotBlank
    private String fullName;

    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getFullName() { return fullName; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setFullName(String fullName) { this.fullName = fullName; }
}
