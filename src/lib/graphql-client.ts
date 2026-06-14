import { GraphQLClient } from 'graphql-request';
import { ensureFreshAccessToken } from './auth-session';

const ENDPOINT =
  import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:3000/graphql';

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await ensureFreshAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Base client for auth operations that must not trigger token refresh. */
export const unauthenticatedGraphQLClient = new GraphQLClient(ENDPOINT, {
  headers: {
    'Content-Type': 'application/json',
    'apollo-require-preflight': 'true',
  },
});

export const graphQLClient = new GraphQLClient(ENDPOINT, {
  requestMiddleware: async (request) => ({
    ...request,
    headers: {
      'Content-Type': 'application/json',
      'apollo-require-preflight': 'true',
      ...(await getAuthHeaders()),
    },
  }),
});

/**
 * Creates a project-scoped GraphQL client that injects the
 * `x-project-id` header required by ProjectPermissionGuard.
 */
export function createProjectClient(projectId: string): GraphQLClient {
  return new GraphQLClient(ENDPOINT, {
    requestMiddleware: async (request) => ({
      ...request,
      headers: {
        'Content-Type': 'application/json',
        'apollo-require-preflight': 'true',
        ...(await getAuthHeaders()),
        'x-project-id': projectId,
      },
    }),
  });
}
