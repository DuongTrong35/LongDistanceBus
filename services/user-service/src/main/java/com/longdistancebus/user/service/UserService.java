package com.longdistancebus.user.service;

import com.longdistancebus.user.api.dto.AuthResponse;
import com.longdistancebus.user.api.dto.LoginRequest;
import com.longdistancebus.user.api.dto.RegisterRequest;
import com.longdistancebus.user.api.dto.VerifyOtpRequest;
import com.longdistancebus.user.api.dto.ForgotPasswordRequest;
import com.longdistancebus.user.api.dto.ResetPasswordRequest;
import com.longdistancebus.user.domain.User;

import java.util.Optional;

public interface UserService {

    String startRegistration(RegisterRequest request);

    boolean verifyOtpAndActivate(VerifyOtpRequest request);

    AuthResponse login(LoginRequest request);

    Optional<User> findByToken(String token);

    void requestPasswordReset(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);
}
