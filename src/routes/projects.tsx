import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ProjectsList } from '../features/projects/ProjectsList';
import { ProjectDetail } from '../features/projects/ProjectDetail';
import { TenderingPage } from '../features/tendering/TenderingPage';

/** Layout shell route — wraps all dashboard pages */
export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'dashboard',
  component: DashboardLayout,
});

/** /projects — projects list */
export const projectsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/projects',
  component: ProjectsList,
});

/** /projects/:projectId — project detail with module cards */
export const projectDetailRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/projects/$projectId',
  component: ProjectDetail,
});

/** /projects/:projectId/tendering — tendering stages */
export const tenderingRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/projects/$projectId/tendering',
  component: TenderingPage,
});