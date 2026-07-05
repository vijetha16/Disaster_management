// src/app/components/person-list/person-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonService } from '../../services/person.service';
import { Person, PERSON_STATUSES } from '../../models/person.model';

@Component({
    selector: 'app-person-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './person-list.component.html',
    styleUrls: ['./person-list.component.css']
})
export class PersonListComponent implements OnInit {
    persons: Person[] = [];
    filteredPersons: Person[] = [];
    newPerson: Person = {
        name: '',
        age: 0,
        location: '',
        status: 'Safe',
        contactNumber: ''
    };
    statuses = PERSON_STATUSES;
    selectedStatus: string = '';
    searchTerm: string = '';
    editingPerson: Person | null = null;

    constructor(private personService: PersonService) {}

    ngOnInit() {
        this.loadPersons();
    }

    loadPersons() {
        this.personService.getAllPersons().subscribe({
            next: (data) => {
                this.persons = data;
                this.applyFilters();
            },
            error: (error) => console.error('Error loading persons:', error)
        });
    }

    addPerson() {
        if (!this.newPerson.name || !this.newPerson.age || !this.newPerson.location) {
            alert('Please fill in all required fields');
            return;
        }

        this.personService.createPerson(this.newPerson).subscribe({
            next: () => {
                this.loadPersons();
                this.newPerson = { name: '', age: 0, location: '', status: 'Safe', contactNumber: '' };
            },
            error: (error) => console.error('Error adding person:', error)
        });
    }

    deletePerson(id: number) {
        if (confirm('Are you sure you want to delete this person?')) {
            this.personService.deletePerson(id).subscribe({
                next: () => this.loadPersons(),
                error: (error) => console.error('Error deleting person:', error)
            });
        }
    }

    startEdit(person: Person) {
        this.editingPerson = { ...person };
    }

    saveEdit() {
        if (this.editingPerson) {
            this.personService.updatePerson(this.editingPerson.id!, this.editingPerson).subscribe({
                next: () => {
                    this.loadPersons();
                    this.editingPerson = null;
                },
                error: (error) => console.error('Error updating person:', error)
            });
        }
    }

    cancelEdit() {
        this.editingPerson = null;
    }

    applyFilters() {
        this.filteredPersons = this.persons.filter(person => {
            const matchesStatus = !this.selectedStatus || person.status === this.selectedStatus;
            const matchesSearch = !this.searchTerm || 
                person.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                person.location.toLowerCase().includes(this.searchTerm.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }

    getStatusColor(status: string): string {
        const colors = {
            'Safe': '#4CAF50',
            'Missing': '#FF5722',
            'Injured': '#FF9800',
            'Deceased': '#9E9E9E'
        };
        return colors[status as keyof typeof colors] || '#9E9E9E';
    }
}
