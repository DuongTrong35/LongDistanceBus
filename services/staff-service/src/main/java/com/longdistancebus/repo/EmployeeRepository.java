package com.longdistancebus.repo;

import com.longdistancebus.domain.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeRepository  extends JpaRepository<Employee, String> {
    List<Employee> findByTennvContainingIgnoreCaseOrSdtContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String tennv, String sdt, String email
    );
}