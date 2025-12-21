export interface AuthUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: 'admin' | 'user';
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupCredentials {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface AuthState {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
}

export interface AuthResponse {
    access_token: string;
}

export interface SignupResponse {
    access_token: string;
    admin: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        createdAt: string;
    };
}
