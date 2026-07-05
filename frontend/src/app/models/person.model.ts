// src/app/models/person.model.ts
export interface Person {
    id?: number;
    name: string;
    age: number;
    location: string;
    status: string;
    incidentId?: number;
    contactNumber?: string;
    lastUpdated?: Date;
    isOfflineSync?: boolean;
}

export const PERSON_STATUSES = ['Safe', 'Missing', 'Injured', 'Deceased'] as const;
export type PersonStatus = typeof PERSON_STATUSES[number];

export interface PersonSummary {
    total: number;
    safe: number;
    missing: number;
    injured: number;
    deceased: number;
}
