package com.disaster.dto;

import com.disaster.models.User;
import java.time.LocalDateTime;

public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String phone;
    private String location;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public UserResponse(User user) {
        id = user.getId();
        name = user.getName();
        email = user.getEmail();
        role = user.getRole();
        phone = user.getPhone();
        location = user.getLocation();
        createdAt = user.getCreatedAt();
        updatedAt = user.getUpdatedAt();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getPhone() {
        return phone;
    }

    public String getLocation() {
        return location;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
