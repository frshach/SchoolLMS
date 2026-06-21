// backend/src/main/java/com/schoollms/controller/AuthController.java
package com.schoollms.controller;

import com.schoollms.dao.UserDAO;
import com.schoollms.model.User;
import com.schoollms.util.JwtUtil;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Configure for Vercel frontend
public class AuthController {

    private final UserDAO userDAO = new UserDAO();
    private final JwtUtil jwtUtil = new JwtUtil();

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String expectedRole = request.get("expectedRole");

        User user = userDAO.login(email, password);
        Map<String, Object> response = new HashMap<>();

        if (user != null) {
            if (expectedRole != null && !expectedRole.equalsIgnoreCase("User") 
                && !user.getRole().equalsIgnoreCase(expectedRole)) {
                response.put("success", false);
                response.put("error", "unauthorized");
                response.put("role", expectedRole);
                return response;
            }

            String token = jwtUtil.generateToken(user);
            response.put("success", true);
            response.put("token", token);
            response.put("user", user);
            return response;
        }

        response.put("success", false);
        response.put("error", "invalid");
        response.put("role", expectedRole);
        return response;
    }

    @PostMapping("/register")
    public Map<String, Boolean> register(@RequestBody User user) {
        UserDAO dao = new UserDAO();
        boolean success = dao.registerUser(user);
        Map<String, Boolean> response = new HashMap<>();
        response.put("success", success);
        return response;
    }

    @PostMapping("/logout")
    public Map<String, String> logout() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logged out successfully");
        return response;
    }
}