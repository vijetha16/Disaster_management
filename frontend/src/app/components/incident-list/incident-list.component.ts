import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncidentService } from '../../services/incident.service';
import { Incident, INCIDENT_SEVERITIES, INCIDENT_STATUSES, INCIDENT_TYPES } from '../../models/incident.model';

@Component({
  selector: 'app-incident-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './incident-list.component.html',
  styleUrls: ['./incident-list.component.css']
})
export class IncidentListComponent implements OnInit {
  incidents: Incident[] = [];
  incidentTypes = INCIDENT_TYPES;
  severities = INCIDENT_SEVERITIES;
  statuses = INCIDENT_STATUSES;
  newIncident: Incident = this.createEmptyIncident();

  constructor(private incidentService: IncidentService) {}

  ngOnInit() {
    this.loadIncidents();
  }

  loadIncidents() {
    this.incidentService.getAllIncidents().subscribe({
      next: incidents => this.incidents = incidents,
      error: error => console.error('Error loading incidents:', error)
    });
  }

  addIncident() {
    if (!this.newIncident.description || !this.newIncident.location) {
      alert('Please fill in description and location');
      return;
    }

    this.incidentService.createIncident(this.newIncident).subscribe({
      next: () => {
        this.newIncident = this.createEmptyIncident();
        this.loadIncidents();
      },
      error: error => console.error('Error adding incident:', error)
    });
  }

  deleteIncident(id: number) {
    if (!confirm('Are you sure you want to delete this incident?')) {
      return;
    }

    this.incidentService.deleteIncident(id).subscribe({
      next: () => this.loadIncidents(),
      error: error => console.error('Error deleting incident:', error)
    });
  }

  private createEmptyIncident(): Incident {
    return {
      type: 'Flood',
      description: '',
      location: '',
      severity: 'Medium',
      status: 'Active',
      reportedBy: 'Control Room',
      affectedAreaRadius: 0
    };
  }
}
