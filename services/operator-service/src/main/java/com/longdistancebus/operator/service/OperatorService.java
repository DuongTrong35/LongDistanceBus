package com.longdistancebus.operator.service;

import com.longdistancebus.operator.domain.Operator;
import com.longdistancebus.operator.repo.OperatorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class OperatorService {
    private final OperatorRepository operatorRepository;

    public OperatorService(OperatorRepository operatorRepository) {
        this.operatorRepository = operatorRepository;
    }

    public List<Operator> getAllOperators() {
        return operatorRepository.findAll();
    }

    // Lấy nhà xe theo ID
    public Optional<Operator> getOperatorById(Long id) {
        return operatorRepository.findById(id);
    }

    // Lấy danh sách nhà xe đang hoạt động
    public List<Operator> getActiveOperators() {
        return operatorRepository.findByStatus("ACTIVE");
    }

    // Thêm nhà xe mới
    public Operator createOperator(Operator operator) {
        // Kiểm tra tên đã tồn tại chưa
        if (operatorRepository.existsByName(operator.getName())) {
            throw new IllegalArgumentException("Tên nhà xe đã tồn tại: " + operator.getName());
        }
        
        // Mặc định status = ACTIVE khi thêm mới
        if (operator.getStatus() == null || operator.getStatus().isEmpty()) {
            operator.setStatus("ACTIVE");
        }
        
        return operatorRepository.save(operator);
    }

    // Cập nhật thông tin nhà xe
    public Operator updateOperator(Long id, Operator updatedOperator) {
        return operatorRepository.findById(id).map(existing -> {
            // Kiểm tra nếu tên thay đổi và đã tồn tại
            if (!existing.getName().equals(updatedOperator.getName()) 
                    && operatorRepository.existsByName(updatedOperator.getName())) {
                throw new IllegalArgumentException("Tên nhà xe đã tồn tại: " + updatedOperator.getName());
            }
            
            existing.setName(updatedOperator.getName());
            existing.setHotline(updatedOperator.getHotline());
            existing.setAddress(updatedOperator.getAddress());
            existing.setDescription(updatedOperator.getDescription());
            
            // Chỉ cập nhật status nếu được cung cấp
            if (updatedOperator.getStatus() != null && !updatedOperator.getStatus().isEmpty()) {
                existing.setStatus(updatedOperator.getStatus());
            }
            
            return operatorRepository.save(existing);
        }).orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhà xe với ID: " + id));
    }

    // "Xóa" nhà xe (chuyển status về INACTIVE)
    public void deleteOperator(Long id) {
        operatorRepository.findById(id).ifPresentOrElse(
            operator -> {
                operator.setStatus("INACTIVE"); // Không xóa hẳn, chỉ ẩn
                operatorRepository.save(operator);
            },
            () -> {
                throw new IllegalArgumentException("Không tìm thấy nhà xe với ID: " + id);
            }
        );
    }

    // Tìm kiếm nhà xe
    public List<Operator> searchOperators(String keyword) {
        // Tìm theo tên hoặc hotline, không phân biệt hoa thường
        return operatorRepository.findByNameContainingIgnoreCaseOrHotlineContainingIgnoreCase(
                keyword, keyword
        );
    }
}

