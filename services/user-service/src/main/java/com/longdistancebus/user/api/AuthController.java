package com.longdistancebus.user.api;

import com.longdistancebus.user.api.dto.AuthResponse;
import com.longdistancebus.user.api.dto.LoginRequest;
import com.longdistancebus.user.api.dto.RegisterRequest;
import com.longdistancebus.user.api.dto.VerifyOtpRequest;
import com.longdistancebus.user.api.dto.ForgotPasswordRequest;
import com.longdistancebus.user.api.dto.ResetPasswordRequest;
import com.longdistancebus.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody RegisterRequest request) {
        Map<String, Object> body = new HashMap<>();
        try {
            String otp = userService.startRegistration(request);
            body.put("success", true);
            body.put("message", "Đã gửi mã OTP tới số điện thoại của bạn");
            body.put("otp", otp);
            return ResponseEntity.ok(body);
        } catch (IllegalStateException ex) {
            body.put("success", false);
            body.put("message", ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtp(@RequestBody VerifyOtpRequest request) {
        Map<String, Object> body = new HashMap<>();
        boolean ok = userService.verifyOtpAndActivate(request);
        if (ok) {
            body.put("success", true);
            body.put("message", "Xác thực OTP thành công, tài khoản đã được kích hoạt");
            return ResponseEntity.ok(body);
        }
        body.put("success", false);
        body.put("message", "Mã OTP không đúng hoặc đã hết hạn");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = userService.login(request);
            return ResponseEntity.ok(response);
        } catch (IllegalStateException ex) {
            Map<String, Object> body = new HashMap<>();
            body.put("success", false);
            body.put("message", ex.getMessage());
            body.put("error", ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader(value = "Authorization", required = false) String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing token");
        }
        String token = authorization.substring(7);
        return userService.findByToken(token)
                .<ResponseEntity<?>>map(user -> {
                    Map<String, Object> body = new HashMap<>();
                    body.put("userId", user.getId());
                    body.put("fullName", user.getFullName());
                    body.put("phone", user.getPhone());
                    return ResponseEntity.ok(body);
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            userService.requestPasswordReset(request);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Đã gửi mã OTP đặt lại mật khẩu"
            ));
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", ex.getMessage()
            ));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            userService.resetPassword(request);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Đặt lại mật khẩu thành công"
            ));
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", ex.getMessage()
            ));
        }
    }
}
