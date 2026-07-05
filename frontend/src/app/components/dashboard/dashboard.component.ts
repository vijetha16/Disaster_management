import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidentService } from '../../services/incident.service';
import { PersonService } from '../../services/person.service';
import { Incident } from '../../models/incident.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  activeIncidents: Incident[] = [];
  stats = {
    totalIncidents: 0,
    activeIncidents: 0,
    totalPersons: 0,
    missingPersons: 0,
    criticalIncidents: 0
  };

  constructor(
    private incidentService: IncidentService,
    private personService: PersonService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.incidentService.getAllIncidents().subscribe({
      next: (incidents) => {
        this.stats.totalIncidents = incidents.length;
        this.stats.activeIncidents = incidents.filter(i => i.status === 'Active').length;
        this.stats.criticalIncidents = incidents.filter(i => i.severity === 'Critical' && i.status === 'Active').length;
        this.activeIncidents = incidents.filter(i => i.status === 'Active').slice(0, 5);
      },
      error: (error) => console.error('Error loading incidents:', error)
    });

    this.personService.getAllPersons().subscribe({
      next: (persons) => {
        this.stats.totalPersons = persons.length;
        this.stats.missingPersons = persons.filter(p => p.status === 'Missing').length;
      },
      error: (error) => console.error('Error loading persons:', error)
    });
  }

  getSeverityClass(severity: string): string {
    const classes: Record<string, string> = {
      'Critical': 'severity-critical',
      'High': 'severity-high',
      'Medium': 'severity-medium',
      'Low': 'severity-low'
    };
    return classes[severity] || '';
  }
}