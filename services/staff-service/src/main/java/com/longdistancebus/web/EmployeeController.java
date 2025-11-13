package com.longdistancebus.web;
import com.longdistancebus.service.EmployeeService;
import com.longdistancebus.domain.Employee;
import com.longdistancebus.repo.EmployeeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    private final EmployeeService employeeService;
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    @GetMapping("/{id}")
    public Employee getById(@PathVariable String id) {
        return employeeService.getEmployeeById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Employee updateEmployee(@PathVariable String id, @RequestBody Employee updatedEmployee) {
        return employeeService.updateEmployee(id, updatedEmployee);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable String id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ Thêm mới nhân viên
    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee newEmployee) {
        Employee created = employeeService.createEmployee(newEmployee);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/search")
    public List<Employee> searchEmployees(@RequestParam String keyword) {
        return employeeService.searchEmployees(keyword);
    }

}
