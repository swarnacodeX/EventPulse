package com.eventpulse.authentication.Controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import com.eventpulse.authentication.Model.JWT;
import com.eventpulse.authentication.Model.UserModel;
import com.eventpulse.authentication.Services.JwtServices;
import com.eventpulse.authentication.Services.UserServices;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    @Autowired
    private UserServices userServices;
    @Autowired
    private JwtServices jwtServices;

    // DTOs defined inline without creating new files
    public static class LoginRequest {
        private String email;
        private String password;
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class ChangePasswordRequest {
        private String oldPassword;
        private String newPassword;
        public ChangePasswordRequest() {}
        public ChangePasswordRequest(String oldPassword, String newPassword) {
            this.oldPassword = oldPassword;
            this.newPassword = newPassword;
        }
        public String getOldPassword() { return oldPassword; }
        public void setOldPassword(String oldPassword) { this.oldPassword = oldPassword; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }

   @PostMapping("/signup")
public ResponseEntity<String> signup(@RequestBody UserModel user) {
    try {
        // Save new user
        String createdUser = userServices.save(user);

        // Generate JWT token (if you want like login)
        JWT token = jwtServices.createToken(createdUser);

        return ResponseEntity.status(HttpStatus.CREATED)
                .header("Access-Token", token.getAccesstoken())
                .header("Refresh-Token", token.getRefreshtoken())
                .body(createdUser);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Signup failed: " + e.getMessage());
    }
}

   
    @Transactional
@PostMapping("/login")
public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest loginRequest,@RequestHeader JWT jwtHeaders) {
    try {
        String result = userServices.login(loginRequest.getEmail(), loginRequest.getPassword());
        
        if (!"Invalid credentials".equals(result)) { // Login successful
            JWT jwt = jwtServices.createToken(result);
            // JWT jwt=jwtServices.validateToken(jwtHeaders);
             // Generate JWT with userID
            Map<String, Object> body = new HashMap<>();
            body.put("success", true);
            body.put("message", "Login successful");
            body.put("user-ID", result);
            return ResponseEntity.ok()
                .header("access-token", jwt.getAccesstoken())
                .header("refresh-token", jwt.getRefreshtoken())
                .header("user-ID", result)
                .body(body);
        } else {
            Map<String, Object> body = new HashMap<>();
            body.put("success", false);
            body.put("message", result);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
        }
    } catch (Exception e) {
        Map<String, Object> body = new HashMap<>();
        body.put("success", false);
        body.put("message", "Login failed: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}

    // Simple profile access using email from header (placeholder for JWT)
    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getUserProfile(@RequestHeader(value = "X-User-Email", required = false) String emailHeader) {
        try {
            if (emailHeader == null || emailHeader.isBlank()) {
                Map<String, Object> err = new HashMap<>();
                err.put("success", false);
                err.put("message", "Missing user context");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
            }
            return userServices.getByEmail(emailHeader)
                .<ResponseEntity<Map<String, Object>>>map(u -> {
                    Map<String, Object> ok = new HashMap<>();
                    ok.put("success", true);
                    Map<String, Object> profile = new HashMap<>();
                    profile.put("username", u.getUsername());
                    profile.put("email", u.getEmail());
                    profile.put("role", u.getRole());
                    profile.put("createdAt", u.getCreatedAt());
                    profile.put("lastLogin", u.getLastLogin());
                    ok.put("user", profile);
                    return ResponseEntity.ok(ok);
                })
                .orElseGet(() -> {
                    Map<String, Object> err = new HashMap<>();
                    err.put("success", false);
                    err.put("message", "User not found");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
                });
        } catch (Exception e) {
            Map<String, Object> body = new HashMap<>();
            body.put("success", false);
            body.put("message", "Failed to get profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        Map<String, Object> body = new HashMap<>();
        body.put("success", true);
        body.put("message", "Logged out");
        return ResponseEntity.ok(body);
    }

    @PutMapping("/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(
            @RequestHeader(value = "X-User-Email", required = false) String emailHeader,
            @RequestBody ChangePasswordRequest changePasswordRequest) {
        try {
            if (emailHeader == null || emailHeader.isBlank()) {
                Map<String, Object> err = new HashMap<>();
                err.put("success", false);
                err.put("message", "Missing user context");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
            }
            String result = userServices.changePassword(
                    emailHeader,
                    changePasswordRequest.getOldPassword(),
                    changePasswordRequest.getNewPassword()
            );
            Map<String, Object> body = new HashMap<>();
            if ("OK".equals(result)) {
                body.put("success", true);
                return ResponseEntity.ok(body);
            } else {
                body.put("success", false);
                body.put("message", result);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
            }
        } catch (Exception e) {
            Map<String, Object> body = new HashMap<>();
            body.put("success", false);
            body.put("message", "Failed to change password: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Authentication service is running!");
    }
}
