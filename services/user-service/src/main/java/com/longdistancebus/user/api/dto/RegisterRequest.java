package com.longdistancebus.user.api.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String phoneNumber;  // Số điện thoại thay cho email
    private String password;
    private String fullName;  // Họ và tên
}
