package com.longdistancebus.payment.web.dto;

import com.longdistancebus.payment.domain.enums.PaymentMethod;
import com.longdistancebus.payment.domain.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private Long id;
    private String paymentCode;
    private Long userId;
    private String employeeId;
    private BigDecimal totalAmount;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;
    private PaymentMethod paymentMethod;
    private PaymentStatus status;
    private LocalDateTime paidAt;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
    private String notes;
    private String paymentUrl; // For VNPay/MoMo redirect
    private List<PaymentDetailResponse> details;
}


