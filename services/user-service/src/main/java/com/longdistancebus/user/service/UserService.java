package com.longdistancebus.user.service;

import com.longdistancebus.user.api.dto.AuthResponse;
import com.longdistancebus.user.api.dto.ForgotPasswordRequest;
import com.longdistancebus.user.api.dto.LoginRequest;
import com.longdistancebus.user.api.dto.RegisterRequest;
import com.longdistancebus.user.api.dto.ResetPasswordRequest;
import com.longdistancebus.user.api.dto.VerifyOtpRequest;
import com.longdistancebus.user.domain.User;
import com.longdistancebus.user.api.dto.ChangePasswordRequest;
import com.longdistancebus.user.api.dto.UpdateProfileRequest;

import java.util.Optional;

public interface UserService {

    String startRegistration(RegisterRequest request);

    boolean verifyOtpAndActivate(VerifyOtpRequest request);

    AuthResponse login(LoginRequest request);

    Optional<User> findByToken(String token);

    // Đổi từ void → String
    String requestPasswordReset(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);

    void changePassword(User user, ChangePasswordRequest request);

    User updateProfile(User user, UpdateProfileRequest request);

}

