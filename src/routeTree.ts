import { rootRoute } from './routes/__root';
import { indexRoute } from './routes/index';
import { registerRoute } from './routes/register';
import { dashboardRoute, projectsRoute } from './routes/projects';

// Add the projects route as a child of the dashboard layout route
dashboardRoute.addChildren([projectsRoute]);

export const routeTree = rootRoute.addChildren([
  indexRoute,
  registerRoute,
  dashboardRoute,
]);