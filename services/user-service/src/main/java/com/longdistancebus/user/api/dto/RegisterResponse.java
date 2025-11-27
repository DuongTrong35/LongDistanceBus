package com.longdistancebus.user.api.dto;

import lombok.Data;

@Data
public class RegisterResponse {
    private String message;  // Thông báo trạng thái đăng ký
    private Long userId;   // ID của người dùng sau khi tạo thành công
}
