package com.longdistancebus.payment.web.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ConfirmCashPaymentRequest {
    @NotBlank(message = "Employee ID is required")
    private String employeeId;
}


