import { jwtDecode } from 'jwt-decode';
import { apiClient } from './api.client';
import type { AuthUser, LoginCredentials, SignupCredentials, AuthResponse, SignupResponse } from '@/types/auth.types';
import { STORAGE_KEYS } from '@/config/constants';
import { createLogger } from '@/utils/logger';

const logger = createLogger('AuthService');

export const authService = {
    // Signup
    signup: async (credentials: SignupCredentials): Promise<{ user: AuthUser; token: string }> => {
        logger.info('Admin signup attempt', { email: credentials.email });
        const response = await apiClient.post<SignupResponse>('/auth/signup', credentials);
        const { access_token, admin } = response.data;

        const authUser: AuthUser = {
            ...admin,
            role: 'admin', // Enforce admin role
        };

        // Store in localStorage
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, access_token);
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(authUser));

        logger.info('Admin signup successful', { adminId: authUser.id, email: authUser.email });
        return { user: authUser, token: access_token };
    },

    // Admin Login
    login: async (credentials: LoginCredentials): Promise<{ user: AuthUser; token: string }> => {
        logger.info('Admin login attempt', { email: credentials.email });
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

        logger.info('Admin login successful', { adminId: authUser.id, email: authUser.email, role: authUser.role });
        return { user: authUser, token: access_token };
    },

    // Admin Logout
    logout: async (): Promise<void> => {
        logger.info('Admin logout initiated');
        try {
            // Call backend logout endpoint
            await apiClient.post('/auth/logout');
        } catch (error) {
            // Continue with logout even if API call fails
            logger.warn('Logout API call failed, clearing local storage anyway', error);
        } finally {
            // Always clear local storage
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
            logger.info('Admin logout completed');
        }
    },

    /**
     * NOTE: Users cannot self-register.
     * Users must be created by admins using the POST /user endpoint.
     * Once created, users can login using userLogin() method below.
     */

    // User Login
    userLogin: async (credentials: LoginCredentials): Promise<{ user: AuthUser; token: string }> => {
        logger.info('User login attempt', { email: credentials.email });
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

        logger.info('User login successful', { userId: authUser.id, email: authUser.email, role: authUser.role });
        return { user: authUser, token: access_token };
    },

    // User Logout
    userLogout: async (): Promise<void> => {
        logger.info('User logout initiated');
        try {
            // Call backend logout endpoint
            await apiClient.post('/auth/user/logout');
        } catch (error) {
            // Continue with logout even if API call fails
            logger.warn('User logout API call failed, clearing local storage anyway', error);
        } finally {
            // Always clear local storage
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
            logger.info('User logout completed');
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
        if (!token) {
            logger.debug('No auth token found');
            return false;
        }

        try {
            const decoded: any = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            if (decoded.exp < currentTime) {
                logger.warn('Token expired, clearing auth data');
                localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
                return false;
            }
            logger.debug('Token is valid');
            return true;
        } catch (error) {
            logger.error('Token validation failed', error);
            return false;
        }
    },
};
