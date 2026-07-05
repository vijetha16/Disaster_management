// src/app/models/incident.model.ts
export interface Incident {
    id?: number;
    type: string;
    description: string;
    location: string;
    severity: string;
    status: string;
    reportedBy: string;
    reportedTime?: Date;
    hazardLevel?: number;
    affectedAreaRadius?: number;
    affectedPersons?: Person[];
}

export const INCIDENT_TYPES = ['Earthquake', 'Flood', 'Cyclone', 'Fire', 'Landslide', 'Tsunami'] as const;
export const INCIDENT_SEVERITIES = ['Critical', 'High', 'Medium', 'Low'] as const;
export const INCIDENT_STATUSES = ['Active', 'Resolved', 'Under Assessment'] as const;
export type IncidentType = typeof INCIDENT_TYPES[number];
export type IncidentSeverity = typeof INCIDENT_SEVERITIES[number];
export type IncidentStatus = typeof INCIDENT_STATUSES[number];