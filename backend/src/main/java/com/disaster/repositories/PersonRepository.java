// src/main/java/com/disaster/repositories/PersonRepository.java
package com.disaster.repositories;

import com.disaster.models.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {
    List<Person> findByIncidentId(Long incidentId);
    
    List<Person> findByStatus(String status);
    
    @Query("SELECT p FROM Person p WHERE p.location LIKE %:location%")
    List<Person> findByLocationContaining(@Param("location") String location);
    
    @Query("SELECT COUNT(p) FROM Person p WHERE p.status = :status")
    Long countByStatus(@Param("status") String status);

    long countByIncidentId(Long incidentId);
}
