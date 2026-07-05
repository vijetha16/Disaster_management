// src/main/java/com/disaster/controllers/PersonController.java
package com.disaster.controllers;

import com.disaster.models.Person;
import com.disaster.services.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/persons")
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200"})
public class PersonController {
    
    @Autowired
    private PersonService personService;
    
    @GetMapping
    public ResponseEntity<List<Person>> getAllPersons() {
        return ResponseEntity.ok(personService.getAllPersons());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Person> getPersonById(@PathVariable Long id) {
        return personService.getPersonById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/incident/{incidentId}")
    public ResponseEntity<List<Person>> getPersonsByIncident(@PathVariable Long incidentId) {
        return ResponseEntity.ok(personService.getPersonsByIncident(incidentId));
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Person>> getPersonsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(personService.getPersonsByStatus(status));
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getPersonSummary() {
        return ResponseEntity.ok(personService.getPersonSummary());
    }
    
    @PostMapping
    public ResponseEntity<Person> createPerson(@RequestBody Person person) {
        return new ResponseEntity<>(personService.createPerson(person), HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Person> updatePerson(@PathVariable Long id, @RequestBody Person person) {
        return ResponseEntity.ok(personService.updatePerson(id, person));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Person> updatePersonStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(personService.updatePersonStatus(id, body.get("status")));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePerson(@PathVariable Long id) {
        personService.deletePerson(id);
        return ResponseEntity.noContent().build();
    }
}
