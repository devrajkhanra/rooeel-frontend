import { rootRoute } from './routes/__root';
import { indexRoute } from './routes/index';
import { registerRoute } from './routes/register';
import {
  dashboardRoute,
  projectsRoute,
  projectDetailRoute,
  tenderingRoute,
} from './routes/projects';

// Register all dashboard child routes
dashboardRoute.addChildren([
  projectsRoute,
  projectDetailRoute,
  tenderingRoute,
]);

export const routeTree = rootRoute.addChildren([
  indexRoute,
  registerRoute,
  dashboardRoute,
]);