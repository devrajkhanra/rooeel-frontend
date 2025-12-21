import { jwtDecode } from 'jwt-decode';
import { apiClient } from './api.client';
import type { AuthUser, LoginCredentials, SignupCredentials, AuthResponse, SignupResponse, UserSignupResponse } from '@/types/auth.types';
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
        const { access_token } = response.data;

        // Decode token to get user ID and role
        const decoded: any = jwtDecode(access_token);
        const userId = decoded.sub || decoded.id;
        const role = decoded.role || 'admin'; // Default to admin for backward compatibility

        if (!userId) {
            throw new Error('Invalid token: missing user ID');
        }

        // Fetch user details from appropriate endpoint based on role
        const endpoint = role === 'admin' ? `/admin/${userId}` : `/user/${userId}`;
        const userResponse = await apiClient.get<AuthUser>(endpoint);
        const user = userResponse.data;

        const authUser: AuthUser = {
            ...user,
            role: role as 'admin' | 'user',
        };

        // Store in localStorage
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, access_token);
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(authUser));

        return { user: authUser, token: access_token };
    },

    // Admin Logout
    logout: async (): Promise<void> => {
        try {
            // Call backend logout endpoint
            await apiClient.post('/auth/logout');
        } catch (error) {
            // Continue with logout even if API call fails
            console.error('Logout API call failed:', error);
        } finally {
            // Always clear local storage
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
        }
    },

    // User Signup
    userSignup: async (credentials: SignupCredentials): Promise<{ user: AuthUser; token: string }> => {
        const response = await apiClient.post<UserSignupResponse>('/auth/user/signup', credentials);
        const { access_token, user } = response.data;

        const authUser: AuthUser = {
            ...user,
            role: 'user', // Enforce user role
        };

        // Store in localStorage
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, access_token);
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(authUser));

        return { user: authUser, token: access_token };
    },

    // User Login
    userLogin: async (credentials: LoginCredentials): Promise<{ user: AuthUser; token: string }> => {
        const response = await apiClient.post<AuthResponse>('/auth/user/login', credentials);
        const { access_token } = response.data;

        // Decode token to get user ID
        const decoded: any = jwtDecode(access_token);
        const userId = decoded.sub || decoded.id;

        if (!userId) {
            throw new Error('Invalid token: missing user ID');
        }

        // Fetch user details
        const userResponse = await apiClient.get<AuthUser>(`/user/${userId}`);
        const user = userResponse.data;

        const authUser: AuthUser = {
            ...user,
            role: 'user', // Enforce user role
        };

        // Store in localStorage
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, access_token);
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(authUser));

        return { user: authUser, token: access_token };
    },

    // User Logout
    userLogout: async (): Promise<void> => {
        try {
            // Call backend logout endpoint
            await apiClient.post('/auth/user/logout');
        } catch (error) {
            // Continue with logout even if API call fails
            console.error('Logout API call failed:', error);
        } finally {
            // Always clear local storage
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
        }
    },

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
        if (!token) return false;

        try {
            const decoded: any = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            if (decoded.exp < currentTime) {
                localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
                return false;
            }
            return true;
        } catch {
            return false;
        }
    },
};
