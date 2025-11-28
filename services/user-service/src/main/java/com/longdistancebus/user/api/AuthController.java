package com.longdistancebus.user.api;

import com.longdistancebus.user.api.dto.AuthResponse;
import com.longdistancebus.user.api.dto.LoginRequest;
import com.longdistancebus.user.api.dto.RegisterRequest;
import com.longdistancebus.user.api.dto.UpdateProfileRequest;
import com.longdistancebus.user.api.dto.VerifyOtpRequest;
import com.longdistancebus.user.api.dto.ForgotPasswordRequest;
import com.longdistancebus.user.api.dto.ResetPasswordRequest;
import com.longdistancebus.user.api.dto.ChangePasswordRequest;
import com.longdistancebus.user.domain.User;
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
    public ResponseEntity<?> me(
            @RequestHeader(value = "Authorization", required = false) String authorization) {

        if (authorization == null || !authorization.startsWith("Bearer ")) {
            Map<String, Object> body = new HashMap<>();
            body.put("success", false);
            body.put("message", "Missing token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
        }

        String token = authorization.substring(7);

        return userService.findByToken(token)
                .<ResponseEntity<?>>map(user -> {
                    // trả thẳng profile (FE fetchProfile() đang expect dạng này)
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("userId", user.getId());
                    userMap.put("fullName", user.getFullName());
                    userMap.put("phone", user.getPhone());
                    userMap.put("dateOfBirth", user.getDateOfBirth());
                    userMap.put("gender", user.getGender());
                    userMap.put("avatar", user.getAvatar());
                    userMap.put("email", user.getEmail());

                    return ResponseEntity.ok(userMap);
                })
                .orElseGet(() -> {
                    Map<String, Object> body = new HashMap<>();
                    body.put("success", false);
                    body.put("message", "Invalid token");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
                });
    }


@PutMapping("/me")
public ResponseEntity<?> updateMe(
        @RequestHeader(value = "Authorization", required = false) String authorization,
        @RequestBody UpdateProfileRequest request) {

    if (authorization == null || !authorization.startsWith("Bearer ")) {
        Map<String, Object> body = new HashMap<>();
        body.put("success", false);
        body.put("message", "Missing token");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }

    String token = authorization.substring(7);

    return userService.findByToken(token)
            .map(user -> {
                // cập nhật dữ liệu
                User updated = userService.updateProfile(user, request);

                // map thông tin user (cho phép value null)
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("userId", updated.getId());
                userMap.put("fullName", updated.getFullName());
                userMap.put("phone", updated.getPhone());
                userMap.put("dateOfBirth", updated.getDateOfBirth());
                userMap.put("email", updated.getEmail());
                userMap.put("gender", updated.getGender());
                userMap.put("avatar", updated.getAvatar());

                // body trả về
                Map<String, Object> body = new HashMap<>();
                body.put("success", true);
                body.put("message", "Cập nhật thông tin tài khoản thành công");
                body.put("user", userMap);

                return ResponseEntity.ok(body);
            })
            .orElseGet(() -> {
                Map<String, Object> body = new HashMap<>();
                body.put("success", false);
                body.put("message", "Invalid token");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
            });
}

    @PostMapping("/forgot-password")
public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
    try {
        String otp = userService.requestPasswordReset(request);
        Map<String, Object> body = new HashMap<>();
        body.put("success", true);
        body.put("message", "Đã gửi mã OTP đặt lại mật khẩu");
        body.put("otp", otp); // ⚠️ chỉ nên dùng ở môi trường dev
        return ResponseEntity.ok(body);
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

        @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestBody ChangePasswordRequest request) {

        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "success", false,
                    "message", "Missing token"
            ));
        }

        String token = authorization.substring(7);

        return userService.findByToken(token)
                .<ResponseEntity<?>>map(user -> {
                    try {
                        userService.changePassword(user, request);
                        return ResponseEntity.ok(Map.of(
                                "success", true,
                                "message", "Đổi mật khẩu thành công"
                        ));
                    } catch (IllegalStateException ex) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                                "success", false,
                                "message", ex.getMessage()
                        ));
                    }
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                        "success", false,
                        "message", "Invalid token"
                )));
    }

    
}
