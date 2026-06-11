import { createRootRoute, Outlet } from '@tanstack/react-router';

export const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background font-sans text-slate-900">
      <Outlet />
    </div>
  ),
});