// src/main/java/com/disaster/models/Person.java
package com.disaster.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "persons")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private Integer age;
    
    @Column(nullable = false)
    private String location;
    
    @Column(nullable = false)
    private String status; // Safe, Missing, Injured, Deceased
    
    @Column(name = "incident_id")
    private Long incidentId;
    
    @Column(name = "contact_number")
    private String contactNumber;
    
    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;
    
    @Column(name = "is_offline_sync")
    private Boolean isOfflineSync = false;
    
    @PrePersist
    protected void onCreate() {
        lastUpdated = LocalDateTime.now();
    }
}