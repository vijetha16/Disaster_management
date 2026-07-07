import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PersonListComponent } from './components/person-list/person-list.component';
import { IncidentListComponent } from './components/incident-list/incident-list.component';
import { SigninComponent } from './components/auth/signin.component';
import { SignupComponent } from './components/auth/signup.component';
import { ProfileComponent } from './components/auth/profile.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'persons', component: PersonListComponent },
    { path: 'incidents', component: IncidentListComponent },
    { path: 'signin', component: SigninComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'profile', component: ProfileComponent },
    { path: '**', redirectTo: '/dashboard' }
];
