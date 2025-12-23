import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '@/types/auth.types';

interface AuthStore {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (user: AuthUser, token: string) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            setAuth: (user, token) =>
                set({
                    user,
                    token,
                    isAuthenticated: true,
                }),
            clearAuth: () =>
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                }),
        }),
        {
            name: 'auth_store', // Changed from STORAGE_KEYS.AUTH_TOKEN to avoid conflict
        }
    )
);
