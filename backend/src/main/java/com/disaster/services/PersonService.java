// src/main/java/com/disaster/services/PersonService.java
package com.disaster.services;

import com.disaster.models.Person;
import com.disaster.repositories.PersonRepository;
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
public class PersonService {
    
    @Autowired
    private PersonRepository personRepository;
    
    public List<Person> getAllPersons() {
        return personRepository.findAll();
    }
    
    public Optional<Person> getPersonById(Long id) {
        return personRepository.findById(id);
    }
    
    public Person createPerson(Person person) {
        person.setIsOfflineSync(false);
        person.setLastUpdated(LocalDateTime.now());
        return personRepository.save(person);
    }
    
    public Person updatePerson(Long id, Person personDetails) {
        Person person = personRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Person not found"));
        
        person.setName(personDetails.getName());
        person.setAge(personDetails.getAge());
        person.setLocation(personDetails.getLocation());
        person.setStatus(personDetails.getStatus());
        person.setIncidentId(personDetails.getIncidentId());
        person.setContactNumber(personDetails.getContactNumber());
        person.setLastUpdated(LocalDateTime.now());
        
        return personRepository.save(person);
    }

    public Person updatePersonStatus(Long id, String status) {
        Person person = personRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Person not found"));

        person.setStatus(status);
        person.setLastUpdated(LocalDateTime.now());
        return personRepository.save(person);
    }
    
    public void deletePerson(Long id) {
        personRepository.deleteById(id);
    }
    
    public List<Person> getPersonsByIncident(Long incidentId) {
        return personRepository.findByIncidentId(incidentId);
    }
    
    public List<Person> getPersonsByStatus(String status) {
        return personRepository.findByStatus(status);
    }
    
    public Long getPersonCountByStatus(String status) {
        return personRepository.countByStatus(status);
    }

    public Map<String, Object> getPersonSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("total", personRepository.count());
        summary.put("safe", personRepository.countByStatus("Safe"));
        summary.put("missing", personRepository.countByStatus("Missing"));
        summary.put("injured", personRepository.countByStatus("Injured"));
        summary.put("deceased", personRepository.countByStatus("Deceased"));
        return summary;
    }
}
