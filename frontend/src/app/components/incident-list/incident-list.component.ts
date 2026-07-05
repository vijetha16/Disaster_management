import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { IncidentService } from '../../services/incident.service';
import { Incident, INCIDENT_SEVERITIES, INCIDENT_STATUSES, INCIDENT_TYPES } from '../../models/incident.model';

@Component({
  selector: 'app-incident-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './incident-list.component.html',
  styleUrls: ['./incident-list.component.css']
})
export class IncidentListComponent implements OnInit, OnDestroy {
  incidents: Incident[] = [];
  filteredIncidents: Incident[] = [];
  incidentTypes = INCIDENT_TYPES;
  severities = INCIDENT_SEVERITIES;
  statuses = INCIDENT_STATUSES;
  selectedStatus = '';
  selectedSeverity = '';
  searchTerm = '';
  locationSearchTerm = '';
  activeLocationSearch = '';
  autoRefresh = true;
  lastUpdated = '';
  errorMessage = '';
  newIncident: Incident = this.createEmptyIncident();

  private refreshSub?: Subscription;

  constructor(private incidentService: IncidentService) {}

  ngOnInit() {
    this.loadIncidents();
    this.refreshSub = interval(7000).subscribe(() => {
      if (this.autoRefresh) {
        this.loadIncidents(false);
      }
    });
  }

  ngOnDestroy() {
    this.refreshSub?.unsubscribe();
  }

  loadIncidents(showErrors = true) {
    this.incidentService.getAllIncidents().subscribe({
      next: incidents => {
        this.incidents = incidents;
        this.applyFilters();
        this.lastUpdated = new Date().toLocaleTimeString();
      },
      error: () => {
        if (showErrors) {
          this.errorMessage = 'Unable to load incidents. Check the backend service.';
        }
      }
    });
  }

  addIncident() {
    if (!this.newIncident.description || !this.newIncident.location || !this.newIncident.reportedBy) {
      this.errorMessage = 'Description, location, and reporter are required.';
      return;
    }

    this.incidentService.createIncident(this.newIncident).subscribe({
      next: () => {
        this.errorMessage = '';
        this.newIncident = this.createEmptyIncident();
        this.loadIncidents();
      },
      error: () => this.errorMessage = 'Could not add incident.'
    });
  }

  setStatus(incident: Incident, status: string) {
    if (!incident.id) {
      return;
    }

    this.incidentService.updateIncidentStatus(incident.id, status).subscribe({
      next: () => this.loadIncidents(false),
      error: () => this.errorMessage = 'Could not update incident status.'
    });
  }

  deleteIncident(id: number) {
    if (!confirm('Delete this incident?')) {
      return;
    }

    this.incidentService.deleteIncident(id).subscribe({
      next: () => this.loadIncidents(),
      error: () => this.errorMessage = 'Could not delete incident.'
    });
  }

  applyFilters() {
    const term = this.searchTerm.trim().toLowerCase();
    const locationTerm = this.activeLocationSearch.trim().toLowerCase();
    this.filteredIncidents = this.incidents
      .filter(incident => !this.selectedStatus || incident.status === this.selectedStatus)
      .filter(incident => !this.selectedSeverity || incident.severity === this.selectedSeverity)
      .filter(incident => !locationTerm || incident.location.toLowerCase().includes(locationTerm))
      .filter(incident => !term ||
        incident.type.toLowerCase().includes(term) ||
        incident.location.toLowerCase().includes(term) ||
        incident.description.toLowerCase().includes(term)
      )
      .sort((a, b) => (b.hazardLevel || 0) - (a.hazardLevel || 0));
  }

  searchByLocation() {
    this.activeLocationSearch = this.locationSearchTerm;
    this.applyFilters();
  }

  clearLocationSearch() {
    this.locationSearchTerm = '';
    this.activeLocationSearch = '';
    this.applyFilters();
  }

  getSeverityClass(severity: string): string {
    return `severity-${severity.toLowerCase().replace(' ', '-')}`;
  }

  private createEmptyIncident(): Incident {
    return {
      type: 'Flood',
      description: '',
      location: '',
      severity: 'Medium',
      status: 'Active',
      reportedBy: 'Control Room',
      affectedAreaRadius: 5
    };
  }
}
