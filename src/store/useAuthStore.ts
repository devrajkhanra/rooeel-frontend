import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '../types/auth.types';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiresAt: number | null;
  login: (
    user: AuthUser,
    accessToken: string,
    refreshToken: string,
    expiresInSeconds: number,
  ) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      accessTokenExpiresAt: null,
      login: (user, accessToken, refreshToken, expiresInSeconds) =>
        set({
          user,
          accessToken,
          refreshToken,
          accessTokenExpiresAt: Date.now() + expiresInSeconds * 1000,
        }),
      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          accessTokenExpiresAt: null,
        }),
    }),
    {
      name: 'rooeel-auth-storage',
    },
  ),
);
