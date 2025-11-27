package com.longdistancebus.user.service;

import com.longdistancebus.user.api.dto.AuthResponse;
import com.longdistancebus.user.api.dto.LoginRequest;
import com.longdistancebus.user.api.dto.RegisterRequest;
import com.longdistancebus.user.api.dto.VerifyOtpRequest;
import com.longdistancebus.user.api.dto.ForgotPasswordRequest;
import com.longdistancebus.user.api.dto.ResetPasswordRequest;
import com.longdistancebus.user.domain.User;
import com.longdistancebus.user.repo.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final OtpService otpService;
    private final Map<String, String> sessionStore = new ConcurrentHashMap<>();

    public UserServiceImpl(UserRepository userRepository, OtpService otpService) {
        this.userRepository = userRepository;
        this.otpService = otpService;
    }

    @Override
    public String startRegistration(RegisterRequest request) {
        String phone = request.getPhone();

        if (userRepository.findByPhone(phone).isPresent()) {
            throw new IllegalStateException("Số điện thoại đã được đăng ký");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setPhone(phone);
        user.setPassword(request.getPassword());
        user.setLocked(false);
        user.setEnabled(false); // chỉ bật sau khi verify OTP

        userRepository.save(user);

        otpService.generateAndSendOtp(phone);
        return otpService.peekOtp(phone);
    }

    @Override
    public boolean verifyOtpAndActivate(VerifyOtpRequest request) {
        boolean valid = otpService.verifyOtp(request.getPhone(), request.getOtp());
        if (!valid) {
            return false;
        }

        Optional<User> userOpt = userRepository.findByPhone(request.getPhone());
        if (userOpt.isEmpty()) {
            return false;
        }

        User user = userOpt.get();
        user.setEnabled(true);
        userRepository.save(user);

        return true;
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByPhone(request.getPhone())
                .orElseThrow(() -> new IllegalStateException("Số điện thoại chưa được đăng ký"));

        if (!user.isEnabled()) {
            throw new IllegalStateException("Tài khoản chưa được kích hoạt (chưa xác thực OTP)");
        }

        if (!user.getPassword().equals(request.getPassword())) {
            throw new IllegalStateException("Sai số điện thoại hoặc mật khẩu");
        }

        String token = "TOKEN-" + UUID.randomUUID();
        sessionStore.put(token, user.getPhone());

        AuthResponse response = new AuthResponse();
        response.setAccessToken(token);
        response.setTokenType("Bearer");
        response.setUserId(user.getId());
        response.setFullName(user.getFullName());
        response.setPhone(user.getPhone());
        return response;
    }

    @Override
    public Optional<User> findByToken(String token) {
        String phone = sessionStore.get(token);
        if (phone == null) {
            return Optional.empty();
        }
        return userRepository.findByPhone(phone);
    }

    @Override
    public void requestPasswordReset(ForgotPasswordRequest request) {
        String phone = request.getPhone();
        User user = userRepository.findByPhone(phone)
                .orElseThrow(() -> new IllegalStateException("Số điện thoại chưa được đăng ký"));

        if (!user.isEnabled()) {
            throw new IllegalStateException("Tài khoản chưa được kích hoạt");
        }

        otpService.generateAndSendOtp(phone);
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        String phone = request.getPhone();
        if (!otpService.verifyOtp(phone, request.getOtp())) {
            throw new IllegalStateException("Mã OTP không đúng hoặc đã hết hạn");
        }

        User user = userRepository.findByPhone(phone)
                .orElseThrow(() -> new IllegalStateException("Số điện thoại chưa được đăng ký"));

        user.setPassword(request.getNewPassword());
        userRepository.save(user);
    }
}
