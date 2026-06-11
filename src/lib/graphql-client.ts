import { GraphQLClient } from 'graphql-request';
import { useAuthStore } from '../store/useAuthStore';

// Point this to your NestJS GraphQL endpoint
const endpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:3000/graphql';

export const graphQLClient = new GraphQLClient(endpoint, {
  requestMiddleware: (request) => {
    // Retrieve token from Zustand store
    const token = useAuthStore.getState().token;
    
    return {
      ...request,
      headers: {
        ...request.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  },
});