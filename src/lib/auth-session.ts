import { GraphQLClient } from 'graphql-request';
import { REFRESH_MUTATION } from './graphql/auth.operations';
import { useAuthStore } from '../store/useAuthStore';
import type { AuthPayload } from '../types/auth.types';

const ENDPOINT =
  import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:3000/graphql';
const REFRESH_SKEW_MS = 60_000;

let refreshPromise: Promise<string | null> | null = null;

const refreshClient = new GraphQLClient(ENDPOINT, {
  headers: {
    'Content-Type': 'application/json',
    'apollo-require-preflight': 'true',
  },
});

export async function ensureFreshAccessToken() {
  const state = useAuthStore.getState();
  if (!state.accessToken) return null;

  const expiresAt = state.accessTokenExpiresAt;
  if (expiresAt && expiresAt - Date.now() > REFRESH_SKEW_MS) {
    return state.accessToken;
  }

  if (!state.refreshToken) {
    return state.accessToken;
  }

  if (!refreshPromise) {
    refreshPromise = refreshAccessToken(state.refreshToken).finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

async function refreshAccessToken(refreshToken: string) {
  try {
    const result = await refreshClient.request<{ refreshToken: AuthPayload }>(
      REFRESH_MUTATION,
      { input: { refreshToken } },
    );
    const payload = result.refreshToken;
    useAuthStore
      .getState()
      .login(
        payload.user,
        payload.accessToken,
        payload.refreshToken,
        payload.expiresInSeconds,
      );
    return payload.accessToken;
  } catch {
    useAuthStore.getState().logout();
    return null;
  }
}
