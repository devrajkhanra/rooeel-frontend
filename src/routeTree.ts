import { rootRoute } from './routes/__root';
import { indexRoute } from './routes/index';
import { registerRoute } from './routes/register';
import {
  dashboardRoute,
  projectsRoute,
  projectDetailRoute,
  projectConfigurationRoute,
  tenderingRoute,
  usersRoute,
} from './routes/projects';

const dashboardRouteWithChildren = dashboardRoute.addChildren([
  projectsRoute,
  projectDetailRoute,
  projectConfigurationRoute,
  tenderingRoute,
  usersRoute,
]);

export const routeTree = rootRoute.addChildren([
  indexRoute,
  registerRoute,
  dashboardRouteWithChildren,
]);
