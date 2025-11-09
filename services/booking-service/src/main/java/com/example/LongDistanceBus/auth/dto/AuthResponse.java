package com.example.LongDistanceBus.auth.dto;

public class AuthResponse {
    private String accessToken;
    private String fullName;

    public AuthResponse() {}
    public AuthResponse(String accessToken, String fullName) {
        this.accessToken = accessToken; this.fullName = fullName;
    }
    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String t) { this.accessToken = t; }
    public String getFullName() { return fullName; }
    public void setFullName(String n) { this.fullName = n; }
}
