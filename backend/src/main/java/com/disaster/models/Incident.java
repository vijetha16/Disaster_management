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
    
    @Transient
    private List<Person> affectedPersons = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        reportedTime = LocalDateTime.now();
        if (status == null) {
            status = "Active";
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getReportedBy() {
        return reportedBy;
    }

    public void setReportedBy(String reportedBy) {
        this.reportedBy = reportedBy;
    }

    public LocalDateTime getReportedTime() {
        return reportedTime;
    }

    public void setReportedTime(LocalDateTime reportedTime) {
        this.reportedTime = reportedTime;
    }

    public Double getHazardLevel() {
        return hazardLevel;
    }

    public void setHazardLevel(Double hazardLevel) {
        this.hazardLevel = hazardLevel;
    }

    public Double getAffectedAreaRadius() {
        return affectedAreaRadius;
    }

    public void setAffectedAreaRadius(Double affectedAreaRadius) {
        this.affectedAreaRadius = affectedAreaRadius;
    }

    public List<Person> getAffectedPersons() {
        return affectedPersons;
    }

    public void setAffectedPersons(List<Person> affectedPersons) {
        this.affectedPersons = affectedPersons;
    }
}
