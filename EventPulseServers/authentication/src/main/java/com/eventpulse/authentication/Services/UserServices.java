package com.eventpulse.authentication.Services;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.eventpulse.authentication.Model.UserModel;
import com.eventpulse.authentication.Repository.UserRepository;

@Service
public class UserServices {

    @Autowired
    private UserRepository userRepository;

    PasswordEncoder passwordEncoder=new BCryptPasswordEncoder();

    public String save(UserModel user) {
        if (user == null ||user.getUsername()==null|| user.getEmail() == null || user.getPassword() == null) {
            return "Invalid payload";
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            return "Email already exists";
        }
        if (user.getUserID() == null) {
            user.setUserID(UUID.randomUUID().toString());
        }
        
        user.setCreatedAt(LocalDateTime.now());
        user.setLastLogin(LocalDateTime.now());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("USER");
        }
        UserModel saved = userRepository.save(user);
        return saved.getId() != null ? "OK:" + saved.getId() : "Error while creating profile";
    }

    public String login(String email, String rawPassword) {
        Optional<UserModel> found = userRepository.findByEmail(email);
        if (found.isEmpty()) {
            return "Invalid credentials";
        }
        UserModel user = found.get();
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            return "Invalid credentials";
        }
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        return user.getUserID();
        
    }

    public Optional<UserModel> getByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<UserModel> getByUserId(UUID userId) {
        return userRepository.findByUserID(userId);
    }

    public String changePassword(String email, String oldPassword, String newPassword) {
        Optional<UserModel> found = userRepository.findByEmail(email);
        if (found.isEmpty()) {
            return "User not found";
        }
        UserModel user = found.get();
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            return "Invalid old password";
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return "OK";
    }
}
