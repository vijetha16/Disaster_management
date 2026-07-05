import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { IncidentService } from '../../services/incident.service';
import { PersonService } from '../../services/person.service';
import { Incident } from '../../models/incident.model';
import { Person, PERSON_STATUSES } from '../../models/person.model';

@Component({
    selector: 'app-person-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './person-list.component.html',
    styleUrls: ['./person-list.component.css']
})
export class PersonListComponent implements OnInit, OnDestroy {
    persons: Person[] = [];
    filteredPersons: Person[] = [];
    incidents: Incident[] = [];
    newPerson: Person = this.createEmptyPerson();
    statuses = PERSON_STATUSES;
    selectedStatus = '';
    selectedIncident = '';
    searchTerm = '';
    locationSearchTerm = '';
    activeLocationSearch = '';
    editingPerson: Person | null = null;
    autoRefresh = true;
    lastUpdated = '';
    errorMessage = '';

    private refreshSub?: Subscription;

    constructor(
        private personService: PersonService,
        private incidentService: IncidentService
    ) {}

    ngOnInit() {
        this.loadAll();
        this.refreshSub = interval(7000).subscribe(() => {
            if (this.autoRefresh) {
                this.loadAll(false);
            }
        });
    }

    ngOnDestroy() {
        this.refreshSub?.unsubscribe();
    }

    loadAll(showErrors = true) {
        this.incidentService.getActiveIncidents().subscribe({
            next: incidents => this.incidents = incidents,
            error: () => {
                if (showErrors) {
                    this.errorMessage = 'Unable to load active incidents.';
                }
            }
        });
        this.loadPersons(showErrors);
    }

    loadPersons(showErrors = true) {
        this.personService.getAllPersons().subscribe({
            next: data => {
                this.persons = data;
                this.applyFilters();
                this.lastUpdated = new Date().toLocaleTimeString();
            },
            error: () => {
                if (showErrors) {
                    this.errorMessage = 'Unable to load people. Check the backend service.';
                }
            }
        });
    }

    addPerson() {
        if (!this.newPerson.name || !this.newPerson.age || !this.newPerson.location) {
            this.errorMessage = 'Name, age, and location are required.';
            return;
        }

        this.personService.createPerson(this.normalizePerson(this.newPerson)).subscribe({
            next: () => {
                this.errorMessage = '';
                this.loadPersons();
                this.newPerson = this.createEmptyPerson();
            },
            error: () => this.errorMessage = 'Could not add person.'
        });
    }

    deletePerson(id: number) {
        if (!confirm('Delete this person record?')) {
            return;
        }

        this.personService.deletePerson(id).subscribe({
            next: () => this.loadPersons(),
            error: () => this.errorMessage = 'Could not delete person.'
        });
    }

    startEdit(person: Person) {
        this.editingPerson = { ...person };
    }

    saveEdit() {
        if (!this.editingPerson?.id) {
            return;
        }

        this.personService.updatePerson(this.editingPerson.id, this.normalizePerson(this.editingPerson)).subscribe({
            next: () => {
                this.loadPersons();
                this.editingPerson = null;
            },
            error: () => this.errorMessage = 'Could not update person.'
        });
    }

    setStatus(person: Person, status: string) {
        if (!person.id) {
            return;
        }

        this.personService.updatePersonStatus(person.id, status).subscribe({
            next: () => this.loadPersons(false),
            error: () => this.errorMessage = 'Could not update person status.'
        });
    }

    cancelEdit() {
        this.editingPerson = null;
    }

    applyFilters() {
        const term = this.searchTerm.trim().toLowerCase();
        const locationTerm = this.activeLocationSearch.trim().toLowerCase();
        const incidentId = this.selectedIncident ? Number(this.selectedIncident) : null;

        this.filteredPersons = this.persons
            .filter(person => !this.selectedStatus || person.status === this.selectedStatus)
            .filter(person => !incidentId || person.incidentId === incidentId)
            .filter(person => !locationTerm || person.location.toLowerCase().includes(locationTerm))
            .filter(person => !term ||
                person.name.toLowerCase().includes(term) ||
                person.location.toLowerCase().includes(term) ||
                (person.contactNumber || '').toLowerCase().includes(term)
            )
            .sort((a, b) => a.status.localeCompare(b.status) || a.name.localeCompare(b.name));
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

    getIncidentLabel(incidentId?: number): string {
        if (!incidentId) {
            return 'Unassigned';
        }
        const incident = this.incidents.find(item => item.id === incidentId);
        return incident ? `${incident.type} - ${incident.location}` : `Incident #${incidentId}`;
    }

    getStatusColor(status: string): string {
        const colors = {
            Safe: '#16a34a',
            Missing: '#dc2626',
            Injured: '#ea580c',
            Deceased: '#475569'
        };
        return colors[status as keyof typeof colors] || '#64748b';
    }

    private normalizePerson(person: Person): Person {
        return {
            ...person,
            incidentId: person.incidentId ? Number(person.incidentId) : undefined
        };
    }

    private createEmptyPerson(): Person {
        return {
            name: '',
            age: 0,
            location: '',
            status: 'Safe',
            contactNumber: ''
        };
    }
}
