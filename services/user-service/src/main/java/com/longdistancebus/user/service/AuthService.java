package com.longdistancebus.user.service;

import com.longdistancebus.user.api.dto.RegisterRequest;
import com.longdistancebus.user.api.dto.RegisterResponse;
import com.longdistancebus.user.domain.User;
import com.longdistancebus.user.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository; // Đảm bảo có repository để lưu người dùng

    public RegisterResponse register(RegisterRequest request) {
        // Kiểm tra số điện thoại có tồn tại không
        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            RegisterResponse response = new RegisterResponse();
            response.setMessage("Số điện thoại đã được đăng ký.");
            return response;
        }

        // Logic đăng ký: tạo người dùng mới và lưu vào database
        User newUser = new User();
        newUser.setPhoneNumber(request.getPhoneNumber());
        newUser.setFullName(request.getFullName());
        newUser.setPasswordHash(request.getPassword());  // Mã hóa mật khẩu trước khi lưu

        // Lưu vào database
        userRepository.save(newUser);

        RegisterResponse response = new RegisterResponse();
        response.setMessage("Đăng ký thành công!");
        response.setUserId(newUser.getId()); // Trả về userId hoặc thông tin khác
        return response;
    }
}
