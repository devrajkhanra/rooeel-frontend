export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    ADMIN_LIST: '/admin',
    ADMIN_DETAIL: '/admin/:id',
    ADMIN_EDIT: '/admin/:id/edit',
} as const;

export const STORAGE_KEYS = {
    AUTH_TOKEN: 'rooeel_auth_token',
    AUTH_USER: 'rooeel_auth_user',
} as const;

export const QUERY_KEYS = {
    ADMINS: 'admins',
    ADMIN: 'admin',
    USERS: 'users',
    USER: 'user',
    CURRENT_USER: 'currentUser',
} as const;
