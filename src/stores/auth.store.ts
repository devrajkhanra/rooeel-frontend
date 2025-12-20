import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '@/types/auth.types';
import { STORAGE_KEYS } from '@/config/constants';

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
            name: STORAGE_KEYS.AUTH_TOKEN,
        }
    )
);
