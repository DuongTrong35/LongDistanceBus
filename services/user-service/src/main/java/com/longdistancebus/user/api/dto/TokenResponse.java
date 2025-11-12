package com.longdistancebus.user.api.dto;

public class TokenResponse {
    private String accessToken;
    private String tokenType = "Bearer";

    public TokenResponse() {}
    public TokenResponse(String accessToken) { this.accessToken = accessToken; }

    public String getAccessToken() { return accessToken; }
    public String getTokenType() { return tokenType; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }
}
