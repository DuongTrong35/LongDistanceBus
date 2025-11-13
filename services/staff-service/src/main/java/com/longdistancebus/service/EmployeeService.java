package com.longdistancebus.service;
import com.longdistancebus.domain.Employee;
import com.longdistancebus.repo.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {
    private  EmployeeRepository employeeRepository;
    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    // ✅ Lấy nhân viên theo ID
    public Optional<Employee> getEmployeeById(String id) {
        return employeeRepository.findById(id);
    }

    public Employee updateEmployee(String id, Employee updatedEmployee) {
        return employeeRepository.findById(id).map(existing -> {
            existing.setHonv(updatedEmployee.getHonv());
            existing.setTennv(updatedEmployee.getTennv());
            existing.setGioitinh(updatedEmployee.getGioitinh());
            existing.setNgaysinh(updatedEmployee.getNgaysinh());
            existing.setCmnd(updatedEmployee.getCmnd());
            existing.setSdt(updatedEmployee.getSdt());
            existing.setEmail(updatedEmployee.getEmail());
            existing.setChucvu(updatedEmployee.getChucvu());
            return employeeRepository.save(existing);
        }).orElse(null);
    }

    // ✅ "Xóa" nhân viên (chuyển tình trạng về 0)
    public void deleteEmployee(String id) {
        employeeRepository.findById(id).ifPresent(employee -> {
            employee.setTinhtrang(0); // ❌ không xóa hẳn, chỉ ẩn
            employeeRepository.save(employee);
        });
    }
//    public void deleteEmployee(String id) {
//        employeeRepository.deleteById(id);
//    }

    // ✅ Thêm nhân viên mới
    public Employee createEmployee(Employee employee) {
        // Nếu muốn mặc định tinhtrang = 1 khi thêm mới
        if (employee.getTinhtrang() == 0) {
            employee.setTinhtrang(1);
        }
        return employeeRepository.save(employee);
    }

    public List<Employee> searchEmployees(String keyword) {
        // Tìm theo tên, sđt hoặc email, không phân biệt hoa thường
        return employeeRepository.findByTennvContainingIgnoreCaseOrSdtContainingIgnoreCaseOrEmailContainingIgnoreCase(
                keyword, keyword, keyword
        );
    }

}