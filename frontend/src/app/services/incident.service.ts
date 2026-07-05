// src/app/services/incident.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Incident, IncidentSummary } from '../models/incident.model';

@Injectable({
    providedIn: 'root'
})
export class IncidentService {
    private apiUrl = '/api/incidents';

    constructor(private http: HttpClient) {}

    getAllIncidents(): Observable<Incident[]> {
        return this.http.get<Incident[]>(this.apiUrl);
    }

    getIncidentById(id: number): Observable<Incident> {
        return this.http.get<Incident>(`${this.apiUrl}/${id}`);
    }

    getActiveIncidents(): Observable<Incident[]> {
        return this.http.get<Incident[]>(`${this.apiUrl}/active`);
    }

    getRecentIncidents(): Observable<Incident[]> {
        return this.http.get<Incident[]>(`${this.apiUrl}/recent`);
    }

    getSummary(): Observable<IncidentSummary> {
        return this.http.get<IncidentSummary>(`${this.apiUrl}/summary`);
    }

    getIncidentsByType(type: string): Observable<Incident[]> {
        return this.http.get<Incident[]>(`${this.apiUrl}/type/${type}`);
    }

    createIncident(incident: Incident): Observable<Incident> {
        return this.http.post<Incident>(this.apiUrl, incident);
    }

    updateIncident(id: number, incident: Incident): Observable<Incident> {
        return this.http.put<Incident>(`${this.apiUrl}/${id}`, incident);
    }

    updateIncidentStatus(id: number, status: string): Observable<Incident> {
        return this.http.patch<Incident>(`${this.apiUrl}/${id}/status`, { status });
    }

    deleteIncident(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
