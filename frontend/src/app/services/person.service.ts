// src/app/services/person.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Person } from '../models/person.model';

@Injectable({
    providedIn: 'root'
})
export class PersonService {
    private apiUrl = '/api/persons';

    constructor(private http: HttpClient) {}

    getAllPersons(): Observable<Person[]> {
        return this.http.get<Person[]>(this.apiUrl);
    }

    getPersonById(id: number): Observable<Person> {
        return this.http.get<Person>(`${this.apiUrl}/${id}`);
    }

    getPersonsByIncident(incidentId: number): Observable<Person[]> {
        return this.http.get<Person[]>(`${this.apiUrl}/incident/${incidentId}`);
    }

    getPersonsByStatus(status: string): Observable<Person[]> {
        return this.http.get<Person[]>(`${this.apiUrl}/status/${status}`);
    }

    createPerson(person: Person): Observable<Person> {
        return this.http.post<Person>(this.apiUrl, person);
    }

    updatePerson(id: number, person: Person): Observable<Person> {
        return this.http.put<Person>(`${this.apiUrl}/${id}`, person);
    }

    deletePerson(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}