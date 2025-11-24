package com.longdistancebus.operator.repo;

import com.longdistancebus.operator.domain.Operator;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OperatorRepository extends JpaRepository<Operator, Long> {
    // Tìm theo tên, không phân biệt hoa thường
    List<Operator> findByNameContainingIgnoreCase(String name);
    
    // Tìm theo status
    List<Operator> findByStatus(String status);
    
    // Tìm theo tên hoặc hotline, không phân biệt hoa thường
    List<Operator> findByNameContainingIgnoreCaseOrHotlineContainingIgnoreCase(
            String name, String hotline
    );
    
    // Kiểm tra tồn tại theo tên
    boolean existsByName(String name);
}

