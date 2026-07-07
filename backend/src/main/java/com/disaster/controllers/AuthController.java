package com.disaster.controllers;

import com.disaster.dto.AuthResponse;
import com.disaster.dto.ProfileUpdateRequest;
import com.disaster.dto.SigninRequest;
import com.disaster.dto.SignupRequest;
import com.disaster.dto.UserResponse;
import com.disaster.services.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200"})
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignupRequest request) {
        UserResponse user = authService.signup(request);
        return new ResponseEntity<>(new AuthResponse(user, "Account created successfully."), HttpStatus.CREATED);
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signin(@RequestBody SigninRequest request) {
        UserResponse user = authService.signin(request);
        return ResponseEntity.ok(new AuthResponse(user, "Signed in successfully."));
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<UserResponse> getProfile(@PathVariable Long id) {
        return ResponseEntity.ok(authService.getProfile(id));
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<UserResponse> updateProfile(@PathVariable Long id, @RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(authService.updateProfile(id, request));
    }
}
