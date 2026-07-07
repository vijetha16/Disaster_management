import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SignupRequest } from '../../models/user.model';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './signup.component.html',
    styleUrls: ['./auth.component.css']
})
export class SignupComponent {
    roles = ['Responder', 'Incident Commander', 'Medical Officer', 'Volunteer', 'Administrator'];
    account: SignupRequest = {
        name: '',
        email: '',
        password: '',
        role: 'Responder',
        phone: '',
        location: ''
    };
    errorMessage = '';
    loading = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    signup() {
        this.errorMessage = '';
        if (!this.account.name || !this.account.email || !this.account.password) {
            this.errorMessage = 'Name, email, and password are required.';
            return;
        }
        if (this.account.password.length < 6) {
            this.errorMessage = 'Password must be at least 6 characters.';
            return;
        }

        this.loading = true;
        this.authService.signup(this.account).subscribe({
            next: () => {
                this.loading = false;
                this.router.navigate(['/profile']);
            },
            error: error => {
                this.loading = false;
                this.errorMessage = error.error?.message || 'Could not create account.';
            }
        });
    }
}
