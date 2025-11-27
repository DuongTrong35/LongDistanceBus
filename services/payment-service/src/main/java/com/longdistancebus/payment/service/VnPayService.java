package com.longdistancebus.payment.service;

import com.longdistancebus.payment.domain.Payment;
import com.longdistancebus.payment.domain.PaymentTransaction;
import com.longdistancebus.payment.domain.enums.PaymentGateway;
import com.longdistancebus.payment.domain.enums.TransactionStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class VnPayService {

    @Value("${vnpay.tmn-code:}")
    private String tmnCode;

    @Value("${vnpay.secret-key:}")
    private String secretKey;

    @Value("${vnpay.url:https://sandbox.vnpayment.vn/paymentv2/vpcpay.html}")
    private String vnpayUrl;

    @Value("${vnpay.return-url:http://localhost:3000/payment/callback}")
    private String returnUrl;

    @Value("${vnpay.callback-url:http://localhost:8085/api/payments/callback/vnpay}")
    private String callbackUrl;

    public PaymentTransaction createPaymentTransaction(Payment payment) {
        PaymentTransaction transaction = new PaymentTransaction();
        transaction.setPayment(payment);
        transaction.setGateway(PaymentGateway.VNPAY);
        transaction.setStatus(TransactionStatus.INIT);
        transaction.setAmount(payment.getFinalAmount());
        transaction.setCallbackUrl(callbackUrl);
        transaction.setReturnUrl(returnUrl);

        // Generate transaction code
        String transactionCode = generateTransactionCode();
        transaction.setTransactionCode(transactionCode);

        return transaction;
    }

    public String getPaymentUrl(Payment payment, PaymentTransaction transaction) {
        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", "2.1.0");
        vnpParams.put("vnp_Command", "pay");
        vnpParams.put("vnp_TmnCode", tmnCode);
        vnpParams.put("vnp_Amount", String.valueOf(payment.getFinalAmount().multiply(new java.math.BigDecimal("100")).longValue()));
        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_TxnRef", transaction.getTransactionCode());
        vnpParams.put("vnp_OrderInfo", "Thanh toan don hang: " + payment.getPaymentCode());
        vnpParams.put("vnp_OrderType", "other");
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_ReturnUrl", returnUrl);
        vnpParams.put("vnp_IpAddr", "127.0.0.1");
        vnpParams.put("vnp_CreateDate", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")));

        // Sort params
        List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
        Collections.sort(fieldNames);

        StringBuilder query = new StringBuilder();
        StringBuilder signData = new StringBuilder();

        for (String fieldName : fieldNames) {
            String fieldValue = vnpParams.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                query.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8))
                        .append("=")
                        .append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8));
                signData.append(fieldName).append("=").append(fieldValue);
                query.append("&");
                signData.append("&");
            }
        }

        // Remove last &
        if (query.length() > 0) {
            query.setLength(query.length() - 1);
            signData.setLength(signData.length() - 1);
        }

        // Generate signature
        String vnp_SecureHash = hmacSHA512(secretKey, signData.toString());
        query.append("&vnp_SecureHash=").append(vnp_SecureHash);

        return vnpayUrl + "?" + query.toString();
    }

    public boolean verifyCallback(Map<String, String> params) {
        String vnp_SecureHash = params.get("vnp_SecureHash");
        params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");

        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);

        StringBuilder signData = new StringBuilder();
        for (String fieldName : fieldNames) {
            String fieldValue = params.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                signData.append(fieldName).append("=").append(fieldValue).append("&");
            }
        }

        if (signData.length() > 0) {
            signData.setLength(signData.length() - 1);
        }

        String calculatedHash = hmacSHA512(secretKey, signData.toString());
        return calculatedHash.equals(vnp_SecureHash);
    }

    private String generateTransactionCode() {
        SecureRandom random = new SecureRandom();
        long randomNum = 1000000000L + random.nextInt(900000000);
        return String.valueOf(randomNum);
    }

    private String hmacSHA512(String key, String data) {
        try {
            Mac hmac512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac512.init(secretKeySpec);
            byte[] hash = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error generating HMAC SHA512", e);
        }
    }
}


