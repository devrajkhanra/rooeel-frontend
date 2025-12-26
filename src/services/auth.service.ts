import { jwtDecode } from 'jwt-decode';
import { apiClient } from './api.client';
import type { AuthUser, LoginCredentials, SignupCredentials, AuthResponse, SignupResponse } from '@/types/auth.types';
import { STORAGE_KEYS } from '@/config/constants';


export const authService = {
    // Signup
    signup: async (credentials: SignupCredentials): Promise<{ user: AuthUser; token: string }> => {
        const response = await apiClient.post<SignupResponse>('/auth/signup', credentials);
        const { access_token, admin } = response.data;

        const authUser: AuthUser = {
            ...admin,
            role: 'admin', // Enforce admin role
        };

        // Store in localStorage
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, access_token);
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(authUser));
        return { user: authUser, token: access_token };
    },

    // Admin Login
    login: async (credentials: LoginCredentials): Promise<{ user: AuthUser; token: string }> => {
        const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
        const { access_token, user } = response.data;

        const authUser: AuthUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        };

        // Store in localStorage
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, access_token);
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(authUser));
        return { user: authUser, token: access_token };
    },

    // Unified Logout (works for both admin and user)
    logout: async (): Promise<void> => {
        try {
            // Call backend logout endpoint
            await apiClient.post('/auth/logout');
        } catch (error) {
            // Continue with logout even if API call fails
        } finally {
            // Always clear local storage
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
        }
    },

    /**
     * NOTE: Users cannot self-register.
     * Users must be created by admins using the POST /user endpoint.
     * Once created, users can login using login() method with role='user'.
     */

    // Get current user from localStorage
    getCurrentUser: (): AuthUser | null => {
        const userStr = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },

    // Check if user is authenticated
    isAuthenticated: (): boolean => {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (!token) {
            return false;
        }

        try {
            const decoded: any = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            if (decoded.exp < currentTime) {
                localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
                return false;
            }
            return true;
        } catch (error) {
            return false;
        }
    },
};
