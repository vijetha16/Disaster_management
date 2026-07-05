// src/main/java/com/disaster/services/PersonService.java
package com.disaster.services;

import com.disaster.models.Person;
import com.disaster.repositories.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
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
}