package com.disaster.dto;

public class AuthResponse {
    private UserResponse user;
    private String message;

    public AuthResponse(UserResponse user, String message) {
        this.user = user;
        this.message = message;
    }

    public UserResponse getUser() {
        return user;
    }

    public String getMessage() {
        return message;
    }
}
