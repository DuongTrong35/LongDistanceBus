package com.longdistancebus.user.api.dto;

public class ForgotPasswordRequest {

    private String phone;

    public ForgotPasswordRequest() {
    }

    public ForgotPasswordRequest(String phone) {
        this.phone = phone;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
