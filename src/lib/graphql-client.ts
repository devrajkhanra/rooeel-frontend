import { GraphQLClient } from 'graphql-request';
import { useAuthStore } from '../store/useAuthStore';

const ENDPOINT =
  import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:3000/graphql';

function getAuthHeaders(): Record<string, string> {
  const token = useAuthStore.getState().accessToken;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Base client — for auth operations (no project header needed). */
export const graphQLClient = new GraphQLClient(ENDPOINT, {
  requestMiddleware: (request) => ({
    ...request,
    headers: {
      ...request.headers,
      ...getAuthHeaders(),
    },
  }),
});

/**
 * Creates a project-scoped GraphQL client that injects the
 * `x-project-id` header required by ProjectPermissionGuard.
 */
export function createProjectClient(projectId: string): GraphQLClient {
  return new GraphQLClient(ENDPOINT, {
    requestMiddleware: (request) => ({
      ...request,
      headers: {
        ...request.headers,
        ...getAuthHeaders(),
        'x-project-id': projectId,
      },
    }),
  });
}