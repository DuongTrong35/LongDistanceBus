package com.longdistancebus.payment.web;

import com.longdistancebus.payment.service.PaymentService;
import com.longdistancebus.payment.service.VnPayService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments/callback")
public class PaymentCallbackController {

    private final PaymentService paymentService;
    private final VnPayService vnPayService;

    public PaymentCallbackController(PaymentService paymentService, VnPayService vnPayService) {
        this.paymentService = paymentService;
        this.vnPayService = vnPayService;
    }

    @PostMapping("/vnpay")
    @GetMapping("/vnpay")
    public ResponseEntity<Map<String, String>> handleVnPayCallback(@RequestParam Map<String, String> params) {
        Map<String, String> response = new HashMap<>();

        try {
            // Verify signature
            if (!vnPayService.verifyCallback(params)) {
                response.put("status", "error");
                response.put("message", "Invalid signature");
                return ResponseEntity.badRequest().body(response);
            }

            String transactionCode = params.get("vnp_TxnRef");
            String responseCode = params.get("vnp_ResponseCode");

            // VNPay response code: "00" means success
            boolean success = "00".equals(responseCode);

            paymentService.handlePaymentCallback(transactionCode, success);

            response.put("status", success ? "success" : "failed");
            response.put("message", success ? "Payment successful" : "Payment failed");
            response.put("transactionCode", transactionCode);

            // Redirect to frontend
            String redirectUrl = "http://localhost:3000/payment/result?status=" +
                    (success ? "success" : "failed") + "&code=" + transactionCode;
            response.put("redirectUrl", redirectUrl);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}


