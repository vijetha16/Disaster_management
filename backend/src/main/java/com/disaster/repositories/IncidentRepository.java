// src/main/java/com/disaster/repositories/IncidentRepository.java
package com.disaster.repositories;

import com.disaster.models.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByStatus(String status);
    
    List<Incident> findByType(String type);
    
    @Query("SELECT i FROM Incident i WHERE i.severity = :severity AND i.status = 'Active'")
    List<Incident> findActiveBySeverity(@Param("severity") String severity);
    
    @Query("SELECT i FROM Incident i ORDER BY i.hazardLevel DESC")
    List<Incident> findAllOrderByHazardLevelDesc();
}