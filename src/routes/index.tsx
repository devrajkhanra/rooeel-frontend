import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root';
import { Login } from '../features/auth/Login';

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Login,
});