package com.longdistancebus.user.service;

import org.springframework.stereotype.Service;

@Service
public class TwilioVerifyService {
    // @Value("${twilio.account-sid}")
    // private String accountSid;

    // @Value("${twilio.auth-token}")
    // private String authToken;

    // @Value("${twilio.verify-service-sid}")
    // private String verifyServiceSid;

    // @PostConstruct
    // public void init() {
    //     Twilio.init(accountSid, authToken);
    // }

    public void sendOtp(String phoneNumber) {
        String to = normalizePhoneNumber(phoneNumber);
        System.out.println("[DEBUG] Đã gọi sendOtp cho số: " + to);
        // Comment lại code gọi Twilio thật
        // Verification.creator(
        //         verifyServiceSid,
        //         to,
        //         "sms"
        // ).create();
    }

    public boolean checkOtp(String phoneNumber, String code) {
        System.out.println("[DEBUG] Đang xác thực OTP: " + code + " cho số " + phoneNumber);
        // Tạm thời luôn trả về true để test
        return true;
    }

    // Chuẩn hoá số VN: 090 -> +8490
    private String normalizePhoneNumber(String phoneNumber) {
        String trimmed = phoneNumber.trim();
        if (trimmed.startsWith("0")) {
            return "+84" + trimmed.substring(1);
        }
        return trimmed; // đã là +84... thì giữ nguyên
    }
}
