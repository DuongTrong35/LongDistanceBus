package com.longdistancebus.payment.web;

import com.longdistancebus.payment.domain.enums.PaymentStatus;
import com.longdistancebus.payment.service.PaymentService;
import com.longdistancebus.payment.web.dto.ConfirmCashPaymentRequest;
import com.longdistancebus.payment.web.dto.CreatePaymentRequest;
import com.longdistancebus.payment.web.dto.PaymentResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<PaymentResponse> createPayment(
            @Valid @RequestBody CreatePaymentRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        Long userId = getUserIdFromJwt(jwt);
        PaymentResponse response = paymentService.createPayment(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponse> getPayment(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {
        Long userId = getUserIdFromJwt(jwt);
        PaymentResponse response = paymentService.getPayment(id, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/code/{paymentCode}")
    public ResponseEntity<PaymentResponse> getPaymentByCode(
            @PathVariable String paymentCode,
            @AuthenticationPrincipal Jwt jwt) {
        Long userId = getUserIdFromJwt(jwt);
        PaymentResponse response = paymentService.getPaymentByCode(paymentCode, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Page<PaymentResponse>> getUserPayments(
            @RequestParam(required = false) PaymentStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal Jwt jwt) {
        Long userId = getUserIdFromJwt(jwt);
        Pageable pageable = PageRequest.of(page, size);
        Page<PaymentResponse> payments = paymentService.getUserPayments(userId, status, pageable);
        return ResponseEntity.ok(payments);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> cancelPayment(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {
        Long userId = getUserIdFromJwt(jwt);
        paymentService.cancelPayment(id, userId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Payment cancelled successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/confirm-cash")
    public ResponseEntity<PaymentResponse> confirmCashPayment(
            @PathVariable Long id,
            @Valid @RequestBody ConfirmCashPaymentRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        // TODO: Check if user has EMPLOYEE or ADMIN role
        PaymentResponse response = paymentService.confirmCashPayment(id, request.getEmployeeId());
        return ResponseEntity.ok(response);
    }

    private Long getUserIdFromJwt(Jwt jwt) {
        Object userIdObj = jwt.getClaim("user_id");
        if (userIdObj instanceof Number) {
            return ((Number) userIdObj).longValue();
        }
        throw new RuntimeException("Invalid user_id in JWT token");
    }
}

