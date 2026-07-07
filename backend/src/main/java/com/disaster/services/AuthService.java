package com.disaster.services;

import com.disaster.dto.ProfileUpdateRequest;
import com.disaster.dto.SigninRequest;
import com.disaster.dto.SignupRequest;
import com.disaster.dto.UserResponse;
import com.disaster.models.User;
import com.disaster.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.HexFormat;

@Service
@Transactional
public class AuthService {
    private final UserRepository userRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserResponse signup(SignupRequest request) {
        validateSignup(request);
        String email = normalizeEmail(request.getEmail());

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new RuntimeException("An account already exists with this email.");
        }

        String salt = createSalt();
        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setSalt(salt);
        user.setPasswordHash(hashPassword(request.getPassword(), salt));
        user.setRole(cleanOrDefault(request.getRole(), "Responder"));
        user.setPhone(cleanOrNull(request.getPhone()));
        user.setLocation(cleanOrNull(request.getLocation()));

        return new UserResponse(userRepository.save(user));
    }

    public UserResponse signin(SigninRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            throw new RuntimeException("Email and password are required.");
        }

        User user = userRepository.findByEmailIgnoreCase(normalizeEmail(request.getEmail()))
            .orElseThrow(() -> new RuntimeException("Invalid email or password."));

        String passwordHash = hashPassword(request.getPassword(), user.getSalt());
        if (!MessageDigest.isEqual(passwordHash.getBytes(StandardCharsets.UTF_8), user.getPasswordHash().getBytes(StandardCharsets.UTF_8))) {
            throw new RuntimeException("Invalid email or password.");
        }

        return new UserResponse(user);
    }

    public UserResponse getProfile(Long id) {
        return new UserResponse(findUser(id));
    }

    public UserResponse updateProfile(Long id, ProfileUpdateRequest request) {
        User user = findUser(id);
        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName().trim());
        }
        user.setRole(cleanOrDefault(request.getRole(), user.getRole()));
        user.setPhone(cleanOrNull(request.getPhone()));
        user.setLocation(cleanOrNull(request.getLocation()));
        return new UserResponse(userRepository.save(user));
    }

    private User findUser(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User profile not found."));
    }

    private void validateSignup(SignupRequest request) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new RuntimeException("Name is required.");
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new RuntimeException("Email is required.");
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters.");
        }
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }

    private String cleanOrDefault(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value.trim();
    }

    private String cleanOrNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private String createSalt() {
        byte[] bytes = new byte[16];
        secureRandom.nextBytes(bytes);
        return HexFormat.of().formatHex(bytes);
    }

    private String hashPassword(String password, String salt) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest((salt + ":" + password).getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("Password hashing is unavailable.", exception);
        }
    }
}
