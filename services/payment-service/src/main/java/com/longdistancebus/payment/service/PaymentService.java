package com.longdistancebus.payment.service;

import com.longdistancebus.payment.domain.Payment;
import com.longdistancebus.payment.domain.PaymentDetail;
import com.longdistancebus.payment.domain.PaymentTransaction;
import com.longdistancebus.payment.domain.enums.PaymentMethod;
import com.longdistancebus.payment.domain.enums.PaymentStatus;
import com.longdistancebus.payment.domain.enums.TransactionStatus;
import com.longdistancebus.payment.repo.PaymentDetailRepository;
import com.longdistancebus.payment.repo.PaymentRepository;
import com.longdistancebus.payment.repo.PaymentTransactionRepository;
import com.longdistancebus.payment.web.dto.CreatePaymentRequest;
import com.longdistancebus.payment.web.dto.PaymentDetailResponse;
import com.longdistancebus.payment.web.dto.PaymentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentDetailRepository paymentDetailRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final VnPayService vnPayService;

    @Value("${payment.timeout-minutes:15}")
    private int timeoutMinutes;

    public PaymentService(
            PaymentRepository paymentRepository,
            PaymentDetailRepository paymentDetailRepository,
            PaymentTransactionRepository paymentTransactionRepository,
            VnPayService vnPayService) {
        this.paymentRepository = paymentRepository;
        this.paymentDetailRepository = paymentDetailRepository;
        this.paymentTransactionRepository = paymentTransactionRepository;
        this.vnPayService = vnPayService;
    }

    @Transactional
    public PaymentResponse createPayment(CreatePaymentRequest request, Long userId) {
        // Generate payment code
        String paymentCode = generatePaymentCode();

        // Create payment entity
        Payment payment = new Payment();
        payment.setPaymentCode(paymentCode);
        payment.setUserId(userId);
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setStatus(PaymentStatus.PENDING);
        payment.setExpiresAt(LocalDateTime.now().plusMinutes(timeoutMinutes));

        // TODO: Verify trip and seats with booking-service
        // For now, we'll use a mock price calculation
        BigDecimal totalAmount = calculateTotalAmount(request);
        BigDecimal discountAmount = BigDecimal.ZERO; // TODO: Apply discount code
        BigDecimal finalAmount = totalAmount.subtract(discountAmount);

        payment.setTotalAmount(totalAmount);
        payment.setDiscountAmount(discountAmount);
        payment.setFinalAmount(finalAmount);

        // Save payment
        payment = paymentRepository.save(payment);

        // Create payment details
        List<PaymentDetail> details = createPaymentDetails(payment, request);
        payment.setDetails(details);
        paymentDetailRepository.saveAll(details);

        // Handle payment method specific logic
        String paymentUrl = null;
        if (request.getPaymentMethod() == PaymentMethod.VNPAY) {
            PaymentTransaction transaction = vnPayService.createPaymentTransaction(payment);
            paymentTransactionRepository.save(transaction);
            paymentUrl = vnPayService.getPaymentUrl(payment, transaction);
        }
        // For CASH payment, no transaction URL needed - will be confirmed by employee

        return toPaymentResponse(payment, paymentUrl);
    }

    private String generatePaymentCode() {
        String datePrefix = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = paymentRepository.count() + 1;
        return String.format("PAY-%s-%04d", datePrefix, count);
    }

    private BigDecimal calculateTotalAmount(CreatePaymentRequest request) {
        // TODO: Get actual price from booking-service
        // For now, using a mock price per seat
        BigDecimal pricePerSeat = new BigDecimal("150000"); // 150,000 VND per seat
        return pricePerSeat.multiply(new BigDecimal(request.getSeatIds().size()));
    }

    private List<PaymentDetail> createPaymentDetails(Payment payment, CreatePaymentRequest request) {
        BigDecimal pricePerSeat = payment.getTotalAmount()
                .divide(new BigDecimal(request.getSeatIds().size()), 2, RoundingMode.HALF_UP);

        return request.getSeatIds().stream().map(seatId -> {
            PaymentDetail detail = new PaymentDetail();
            detail.setPayment(payment);
            detail.setTripId(request.getTripId());
            detail.setSeatId(seatId);
            detail.setSeatCode("SEAT-" + seatId); // TODO: Get actual seat code from booking-service
            detail.setUnitPrice(pricePerSeat);
            detail.setQuantity(1);
            detail.setSubtotal(pricePerSeat);
            return detail;
        }).collect(Collectors.toList());
    }

    public PaymentResponse getPayment(Long paymentId, Long userId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        // Check authorization
        if (!payment.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to payment");
        }

        return toPaymentResponse(payment, null);
    }

    public PaymentResponse getPaymentByCode(String paymentCode, Long userId) {
        Payment payment = paymentRepository.findByPaymentCode(paymentCode)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (!payment.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to payment");
        }

        return toPaymentResponse(payment, null);
    }

    public Page<PaymentResponse> getUserPayments(Long userId, PaymentStatus status, Pageable pageable) {
        Page<Payment> payments;
        if (status != null) {
            payments = paymentRepository.findByUserIdAndStatus(userId, status, pageable);
        } else {
            payments = paymentRepository.findByUserId(userId, pageable);
        }

        return payments.map(p -> toPaymentResponse(p, null));
    }

    @Transactional
    public PaymentResponse cancelPayment(Long paymentId, Long userId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (!payment.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to payment");
        }

        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new RuntimeException("Only pending payments can be cancelled");
        }

        payment.setStatus(PaymentStatus.CANCELLED);
        payment = paymentRepository.save(payment);

        // TODO: Release seats in booking-service

        return toPaymentResponse(payment, null);
    }

    @Transactional
    public PaymentResponse confirmCashPayment(Long paymentId, String employeeId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getPaymentMethod() != PaymentMethod.CASH) {
            throw new RuntimeException("Only cash payments can be confirmed");
        }

        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new RuntimeException("Payment is not in pending status");
        }

        payment.setStatus(PaymentStatus.COMPLETED);
        payment.setEmployeeId(employeeId);
        payment.setPaidAt(LocalDateTime.now());
        payment = paymentRepository.save(payment);

        // TODO: Create ticket in booking-service

        return toPaymentResponse(payment, null);
    }

    @Transactional
    public void handlePaymentCallback(String transactionCode, boolean success) {
        PaymentTransaction transaction = paymentTransactionRepository.findByTransactionCode(transactionCode)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        Payment payment = transaction.getPayment();

        if (success) {
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setPaidAt(LocalDateTime.now());
            transaction.setStatus(TransactionStatus.SUCCESS);
            // TODO: Create ticket in booking-service
        } else {
            payment.setStatus(PaymentStatus.FAILED);
            transaction.setStatus(TransactionStatus.FAILED);
            // TODO: Release seats in booking-service
        }

        paymentRepository.save(payment);
        paymentTransactionRepository.save(transaction);
    }

    private PaymentResponse toPaymentResponse(Payment payment, String paymentUrl) {
        List<PaymentDetailResponse> detailResponses = payment.getDetails().stream()
                .map(detail -> new PaymentDetailResponse(
                        detail.getId(),
                        detail.getTripId(),
                        detail.getSeatId(),
                        detail.getSeatCode(),
                        detail.getUnitPrice(),
                        detail.getQuantity(),
                        detail.getSubtotal()
                ))
                .collect(Collectors.toList());

        return new PaymentResponse(
                payment.getId(),
                payment.getPaymentCode(),
                payment.getUserId(),
                payment.getEmployeeId(),
                payment.getTotalAmount(),
                payment.getDiscountAmount(),
                payment.getFinalAmount(),
                payment.getPaymentMethod(),
                payment.getStatus(),
                payment.getPaidAt(),
                payment.getExpiresAt(),
                payment.getCreatedAt(),
                payment.getNotes(),
                paymentUrl,
                detailResponses
        );
    }
}

