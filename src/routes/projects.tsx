import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ProjectsList } from '../features/projects/ProjectsList';

// First, create the Layout Route
export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'dashboard',
  component: DashboardLayout,
});

// Then, create the Projects route as a child of the Layout
export const projectsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/projects',
  component: ProjectsList,
});