package com.longdistancebus.payment.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDetailResponse {
    private Long id;
    private Long tripId;
    private Long seatId;
    private String seatCode;
    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal subtotal;
}


