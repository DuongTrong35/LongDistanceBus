package com.longdistancebus.user.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class OtpService {
    private final Map<String, String> otpStorage = new ConcurrentHashMap<>();
    private final TwilioVerifyService twilioVerifyService;

    public void generateAndSendOtp(String phoneNumber) {
        // Tạo mã OTP ngẫu nhiên 6 chữ số
        String otp = String.format("%06d", new Random().nextInt(999999));
        // Lưu vào bộ nhớ tạm
        otpStorage.put(phoneNumber, otp);
        
        // In ra console để test
        System.out.println("\n=== THÔNG TIN OTP (CHỈ DÙNG CHO MÔI TRƯỜNG PHÁT TRIỂN) ===");
        System.out.println("Số điện thoại: " + phoneNumber);
        System.out.println("Mã OTP: " + otp);
        System.out.println("Thời hạn: 5 phút");
        System.out.println("===========================================\n");
        
        // Gửi OTP thật nếu cần (đã comment lại)
        // twilioVerifyService.sendOtp(phoneNumber);
    }

    public boolean verifyOtp(String phoneNumber, String otp) {
        String storedOtp = otpStorage.get(phoneNumber);
        if (storedOtp != null && storedOtp.equals(otp)) {
            // Xóa OTP sau khi xác thực thành công
            otpStorage.remove(phoneNumber);
            return true;
        }
        return false;
    }

    public String peekOtp(String phoneNumber) {
        return otpStorage.get(phoneNumber);
    }
}
