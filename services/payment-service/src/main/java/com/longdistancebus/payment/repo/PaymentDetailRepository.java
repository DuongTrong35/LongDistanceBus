package com.longdistancebus.payment.repo;

import com.longdistancebus.payment.domain.PaymentDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentDetailRepository extends JpaRepository<PaymentDetail, Long> {
    List<PaymentDetail> findByPaymentId(Long paymentId);
}


