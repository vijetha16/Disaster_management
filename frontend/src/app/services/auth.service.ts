import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, ProfileUpdateRequest, SigninRequest, SignupRequest, User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8080/api/auth';
    private storageKey = 'disasterCurrentUser';
    private currentUserSubject = new BehaviorSubject<User | null>(this.loadStoredUser());
    currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) {}

    get currentUser(): User | null {
        return this.currentUserSubject.value;
    }

    signup(request: SignupRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, request)
            .pipe(tap(response => this.setCurrentUser(response.user)));
    }

    signin(request: SigninRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/signin`, request)
            .pipe(tap(response => this.setCurrentUser(response.user)));
    }

    getProfile(userId: number): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/profile/${userId}`)
            .pipe(tap(user => this.setCurrentUser(user)));
    }

    updateProfile(userId: number, request: ProfileUpdateRequest): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/profile/${userId}`, request)
            .pipe(tap(user => this.setCurrentUser(user)));
    }

    signout() {
        localStorage.removeItem(this.storageKey);
        this.currentUserSubject.next(null);
    }

    private setCurrentUser(user: User) {
        localStorage.setItem(this.storageKey, JSON.stringify(user));
        this.currentUserSubject.next(user);
    }

    private loadStoredUser(): User | null {
        const rawUser = localStorage.getItem(this.storageKey);
        if (!rawUser) {
            return null;
        }

        try {
            return JSON.parse(rawUser) as User;
        } catch {
            localStorage.removeItem(this.storageKey);
            return null;
        }
    }
}
