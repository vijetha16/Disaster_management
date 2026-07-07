export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    phone?: string;
    location?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface AuthResponse {
    user: User;
    message: string;
}

export interface SignupRequest {
    name: string;
    email: string;
    password: string;
    role: string;
    phone?: string;
    location?: string;
}

export interface SigninRequest {
    email: string;
    password: string;
}

export interface ProfileUpdateRequest {
    name: string;
    role: string;
    phone?: string;
    location?: string;
}
