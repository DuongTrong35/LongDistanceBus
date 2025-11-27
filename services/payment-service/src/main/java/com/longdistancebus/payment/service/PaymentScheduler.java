package com.longdistancebus.payment.service;

import com.longdistancebus.payment.domain.Payment;
import com.longdistancebus.payment.domain.enums.PaymentStatus;
import com.longdistancebus.payment.repo.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class PaymentScheduler {

    private static final Logger logger = LoggerFactory.getLogger(PaymentScheduler.class);

    private final PaymentRepository paymentRepository;

    public PaymentScheduler(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Scheduled(fixedRate = 60000) // Run every minute
    @Transactional
    public void cancelExpiredPayments() {
        LocalDateTime now = LocalDateTime.now();
        List<Payment> expiredPayments = paymentRepository.findExpiredPayments(PaymentStatus.PENDING, now);

        if (!expiredPayments.isEmpty()) {
            logger.info("Found {} expired payments to cancel", expiredPayments.size());
            for (Payment payment : expiredPayments) {
                payment.setStatus(PaymentStatus.CANCELLED);
                logger.info("Cancelled expired payment: {}", payment.getPaymentCode());
                // TODO: Release seats in booking-service
            }
            paymentRepository.saveAll(expiredPayments);
        }
    }
}


