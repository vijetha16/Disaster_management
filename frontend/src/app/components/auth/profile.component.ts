import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProfileUpdateRequest, User } from '../../models/user.model';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './profile.component.html',
    styleUrls: ['./auth.component.css']
})
export class ProfileComponent implements OnInit {
    roles = ['Responder', 'Incident Commander', 'Medical Officer', 'Volunteer', 'Administrator'];
    user: User | null = null;
    profile: ProfileUpdateRequest = {
        name: '',
        role: 'Responder',
        phone: '',
        location: ''
    };
    errorMessage = '';
    successMessage = '';
    loading = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit() {
        this.user = this.authService.currentUser;
        if (!this.user) {
            return;
        }

        this.setProfile(this.user);
        this.authService.getProfile(this.user.id).subscribe({
            next: user => {
                this.user = user;
                this.setProfile(user);
            },
            error: () => this.errorMessage = 'Could not refresh profile from backend.'
        });
    }

    saveProfile() {
        if (!this.user) {
            return;
        }

        this.errorMessage = '';
        this.successMessage = '';
        this.loading = true;
        this.authService.updateProfile(this.user.id, this.profile).subscribe({
            next: user => {
                this.user = user;
                this.setProfile(user);
                this.loading = false;
                this.successMessage = 'Profile updated.';
            },
            error: error => {
                this.loading = false;
                this.errorMessage = error.error?.message || 'Could not update profile.';
            }
        });
    }

    signout() {
        this.authService.signout();
        this.router.navigate(['/signin']);
    }

    private setProfile(user: User) {
        this.profile = {
            name: user.name,
            role: user.role,
            phone: user.phone || '',
            location: user.location || ''
        };
    }
}
