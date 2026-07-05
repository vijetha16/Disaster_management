// src/main/java/com/disaster/services/IncidentService.java
package com.disaster.services;

import com.disaster.models.Incident;
import com.disaster.repositories.IncidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class IncidentService {
    
    @Autowired
    private IncidentRepository incidentRepository;
    
    public List<Incident> getAllIncidents() {
        return incidentRepository.findAllOrderByHazardLevelDesc();
    }
    
    public Optional<Incident> getIncidentById(Long id) {
        return incidentRepository.findById(id);
    }
    
    public Incident createIncident(Incident incident) {
        // Calculate hazard level based on type and severity
        incident.setHazardLevel(calculateHazardLevel(incident));
        incident.setReportedTime(LocalDateTime.now());
        return incidentRepository.save(incident);
    }
    
    public Incident updateIncident(Long id, Incident incidentDetails) {
        Incident incident = incidentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Incident not found"));
        
        incident.setType(incidentDetails.getType());
        incident.setDescription(incidentDetails.getDescription());
        incident.setLocation(incidentDetails.getLocation());
        incident.setSeverity(incidentDetails.getSeverity());
        incident.setStatus(incidentDetails.getStatus());
        incident.setReportedBy(incidentDetails.getReportedBy());
        incident.setHazardLevel(calculateHazardLevel(incidentDetails));
        incident.setAffectedAreaRadius(incidentDetails.getAffectedAreaRadius());
        
        return incidentRepository.save(incident);
    }

    public Incident updateIncidentStatus(Long id, String status) {
        Incident incident = incidentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Incident not found"));

        incident.setStatus(status);
        return incidentRepository.save(incident);
    }
    
    public void deleteIncident(Long id) {
        incidentRepository.deleteById(id);
    }
    
    public List<Incident> getActiveIncidents() {
        return incidentRepository.findByStatus("Active");
    }
    
    public List<Incident> getIncidentsByType(String type) {
        return incidentRepository.findByType(type);
    }

    public List<Incident> getRecentIncidents() {
        return incidentRepository.findTop5ByOrderByReportedTimeDesc();
    }

    public Map<String, Object> getIncidentSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("total", incidentRepository.count());
        summary.put("active", incidentRepository.countByStatus("Active"));
        summary.put("resolved", incidentRepository.countByStatus("Resolved"));
        summary.put("underAssessment", incidentRepository.countByStatus("Under Assessment"));
        summary.put("critical", incidentRepository.countBySeverity("Critical"));
        summary.put("high", incidentRepository.countBySeverity("High"));
        summary.put("recent", getRecentIncidents());
        return summary;
    }
    
    private Double calculateHazardLevel(Incident incident) {
        // Multi-hazard severity calculation
        String severity = incident.getSeverity() == null ? "" : incident.getSeverity();
        String type = incident.getType() == null ? "" : incident.getType();

        double baseScore = switch(severity) {
            case "Critical" -> 10.0;
            case "High" -> 7.0;
            case "Medium" -> 4.0;
            case "Low" -> 2.0;
            default -> 1.0;
        };
        
        // Type-based multiplier
        double multiplier = switch(type) {
            case "Earthquake" -> 1.2;
            case "Tsunami" -> 1.3;
            case "Cyclone" -> 1.1;
            case "Flood" -> 1.0;
            case "Fire" -> 0.9;
            default -> 1.0;
        };
        
        double radiusBoost = incident.getAffectedAreaRadius() == null ? 0.0 : Math.min(2.0, incident.getAffectedAreaRadius() / 50.0);
        return Math.round((baseScore * multiplier + radiusBoost) * 10.0) / 10.0;
    }
}
