package com.longdistancebus.user.api;

import com.longdistancebus.user.domain.User;
import com.longdistancebus.user.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserIdentityController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/findByPhone")
    public User getUserByPhone(@RequestParam String phoneNumber) {
        // Sử dụng số điện thoại thay vì email
        User user = userRepository.findByPhoneNumber(phoneNumber);
        return user;
    }

    @GetMapping("/getUser")
    public String getEmail(@RequestParam Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            return user.getPhoneNumber();  // Trả về số điện thoại thay vì email
        }
        return "User not found!";
    }
}
