// src/main/java/com/disaster/DisasterManagementApplication.java
package com.disaster;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DisasterManagementApplication {
    public static void main(String[] args) {
        SpringApplication.run(DisasterManagementApplication.class, args);
        System.out.println("🚀 Disaster Management System Started Successfully!");
    }
}