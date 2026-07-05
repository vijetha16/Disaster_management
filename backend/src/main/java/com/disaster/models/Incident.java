// src/main/java/com/disaster/models/Incident.java
package com.disaster.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "incidents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Incident {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String type; // Earthquake, Flood, Cyclone, Fire, Landslide
    
    @Column(nullable = false)
    private String description;
    
    @Column(nullable = false)
    private String location;
    
    @Column(nullable = false)
    private String severity; // Critical, High, Medium, Low
    
    @Column(nullable = false)
    private String status; // Active, Resolved, Under Assessment
    
    @Column(name = "reported_by")
    private String reportedBy;
    
    @Column(name = "reported_time")
    private LocalDateTime reportedTime;
    
    @Column(name = "hazard_level")
    private Double hazardLevel; // Calculated multi-hazard score
    
    @Column(name = "affected_area_radius")
    private Double affectedAreaRadius; // in kilometers
    
    @OneToMany(mappedBy = "incidentId", cascade = CascadeType.ALL)
    private List<Person> affectedPersons = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        reportedTime = LocalDateTime.now();
        if (status == null) {
            status = "Active";
        }
    }
}