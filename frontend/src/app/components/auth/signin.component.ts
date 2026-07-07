import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-signin',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './signin.component.html',
    styleUrls: ['./auth.component.css']
})
export class SigninComponent {
    credentials = {
        email: '',
        password: ''
    };
    errorMessage = '';
    loading = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    signin() {
        this.errorMessage = '';
        if (!this.credentials.email || !this.credentials.password) {
            this.errorMessage = 'Email and password are required.';
            return;
        }

        this.loading = true;
        this.authService.signin(this.credentials).subscribe({
            next: () => {
                this.loading = false;
                this.router.navigate(['/profile']);
            },
            error: error => {
                this.loading = false;
                this.errorMessage = error.error?.message || 'Could not sign in.';
            }
        });
    }
}
