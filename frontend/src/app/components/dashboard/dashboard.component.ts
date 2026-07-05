import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, interval, Subscription } from 'rxjs';
import { IncidentService } from '../../services/incident.service';
import { PersonService } from '../../services/person.service';
import { Incident, IncidentSummary } from '../../models/incident.model';
import { PersonSummary } from '../../models/person.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  incidentSummary: IncidentSummary = {
    total: 0,
    active: 0,
    resolved: 0,
    underAssessment: 0,
    critical: 0,
    high: 0,
    recent: []
  };
  personSummary: PersonSummary = {
    total: 0,
    safe: 0,
    missing: 0,
    injured: 0,
    deceased: 0
  };
  activeIncidents: Incident[] = [];
  lastUpdated = '';
  autoRefresh = true;
  loading = false;
  errorMessage = '';

  private refreshSub?: Subscription;

  constructor(
    private incidentService: IncidentService,
    private personService: PersonService
  ) {}

  ngOnInit() {
    this.loadData();
    this.refreshSub = interval(5000).subscribe(() => {
      if (this.autoRefresh) {
        this.loadData(false);
      }
    });
  }

  ngOnDestroy() {
    this.refreshSub?.unsubscribe();
  }

  loadData(showLoading = true) {
    this.loading = showLoading;
    this.errorMessage = '';

    forkJoin({
      incidentSummary: this.incidentService.getSummary(),
      personSummary: this.personService.getSummary(),
      activeIncidents: this.incidentService.getActiveIncidents()
    }).subscribe({
      next: ({ incidentSummary, personSummary, activeIncidents }) => {
        this.incidentSummary = incidentSummary;
        this.personSummary = personSummary;
        this.activeIncidents = activeIncidents
          .sort((a, b) => (b.hazardLevel || 0) - (a.hazardLevel || 0))
          .slice(0, 6);
        this.lastUpdated = new Date().toLocaleTimeString();
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to reach the backend. Check that Spring Boot is running on port 8080.';
        this.loading = false;
      }
    });
  }

  setIncidentStatus(incident: Incident, status: string) {
    if (!incident.id) {
      return;
    }

    this.incidentService.updateIncidentStatus(incident.id, status).subscribe({
      next: () => this.loadData(false),
      error: () => this.errorMessage = 'Could not update incident status.'
    });
  }

  getRiskLevel(): string {
    if (this.incidentSummary.critical > 0 || this.personSummary.missing > 0) {
      return 'Critical';
    }
    if (this.incidentSummary.high > 0 || this.incidentSummary.active > 2) {
      return 'High';
    }
    if (this.incidentSummary.active > 0) {
      return 'Elevated';
    }
    return 'Stable';
  }

  getSeverityClass(severity: string): string {
    const classes: Record<string, string> = {
      Critical: 'severity-critical',
      High: 'severity-high',
      Medium: 'severity-medium',
      Low: 'severity-low'
    };
    return classes[severity] || 'severity-low';
  }
}
