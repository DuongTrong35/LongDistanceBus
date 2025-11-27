package com.longdistancebus.payment.web.dto;

import com.longdistancebus.payment.domain.enums.PaymentMethod;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.util.List;

@Data
public class CreatePaymentRequest {
    @NotNull(message = "Trip ID is required")
    @Positive(message = "Trip ID must be positive")
    private Long tripId;

    @NotEmpty(message = "At least one seat must be selected")
    private List<Long> seatIds;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod; // VNPAY or CASH

    private String discountCode; // Optional
}

