package com.longdistancebus.user.repo;

import com.longdistancebus.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Thay đổi findByEmail thành findByPhoneNumber
    boolean existsByPhoneNumber(String phoneNumber);

    // Thêm phương thức tìm kiếm theo số điện thoại
    User findByPhoneNumber(String phoneNumber);  // Tìm người dùng bằng số điện thoại
}
