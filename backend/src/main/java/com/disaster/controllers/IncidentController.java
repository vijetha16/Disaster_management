// src/main/java/com/disaster/controllers/IncidentController.java
package com.disaster.controllers;

import com.disaster.models.Incident;
import com.disaster.services.IncidentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/incidents")
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200"})
public class IncidentController {
    
    @Autowired
    private IncidentService incidentService;
    
    @GetMapping
    public ResponseEntity<List<Incident>> getAllIncidents() {
        return ResponseEntity.ok(incidentService.getAllIncidents());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Incident> getIncidentById(@PathVariable Long id) {
        return incidentService.getIncidentById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<Incident>> getActiveIncidents() {
        return ResponseEntity.ok(incidentService.getActiveIncidents());
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Incident>> getIncidentsByType(@PathVariable String type) {
        return ResponseEntity.ok(incidentService.getIncidentsByType(type));
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Incident>> getRecentIncidents() {
        return ResponseEntity.ok(incidentService.getRecentIncidents());
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getIncidentSummary() {
        return ResponseEntity.ok(incidentService.getIncidentSummary());
    }
    
    @PostMapping
    public ResponseEntity<Incident> createIncident(@RequestBody Incident incident) {
        return new ResponseEntity<>(incidentService.createIncident(incident), HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Incident> updateIncident(@PathVariable Long id, @RequestBody Incident incident) {
        return ResponseEntity.ok(incidentService.updateIncident(id, incident));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Incident> updateIncidentStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(incidentService.updateIncidentStatus(id, body.get("status")));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncident(@PathVariable Long id) {
        incidentService.deleteIncident(id);
        return ResponseEntity.noContent().build();
    }
}
