import { Link, Outlet, useNavigate, useLocation } from '@tanstack/react-router';
import {
  LayoutDashboard,
  Folder,
  ShoppingCart,
  LineChart,
  HelpCircle,
  LogOut,
  Bell,
  Settings,
  Search,
  Users,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { unauthenticatedGraphQLClient } from '../../lib/graphql-client';
import { LOGOUT_MUTATION } from '../../lib/graphql/auth.operations';

type DashboardPath = '/projects' | '/users';

const NAV_ITEMS: Array<{
  label: string;
  to: DashboardPath | null;
  icon: typeof LayoutDashboard;
}> = [
  { label: 'Dashboard', to: null, icon: LayoutDashboard },
  { label: 'Projects', to: '/projects', icon: Folder },
  { label: 'Users', to: '/users', icon: Users },
  { label: 'Procurement', to: null, icon: ShoppingCart },
  { label: 'Financials', to: null, icon: LineChart },
  { label: 'Analytics', to: null, icon: LineChart },
];

const RESOURCE_ITEMS: Array<{
  label: string;
  to: DashboardPath | null;
  icon: typeof LayoutDashboard;
}> = [{ label: 'Support', to: null, icon: HelpCircle }];

export function DashboardLayout() {
  const { user, refreshToken, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    if (refreshToken) {
      try {
        await unauthenticatedGraphQLClient.request(LOGOUT_MUTATION, {
          input: { refreshToken },
        });
      } catch {
        // Silent — still clear local state
      }
    }
    logout();
    navigate({ to: '/' });
  };

  const userInitials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : 'U';

  return (
    <div className="min-h-screen bg-[#F8FAFC] lg:flex">
      {/* Sidebar */}
      <aside className="hidden w-[240px] flex-shrink-0 flex-col border-r border-slate-200 bg-[#F8FAFC] lg:flex">
        {/* Branding */}
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-[#002b85] font-bold text-white text-sm">
            E
          </div>
          <div>
            <h2 className="text-[14px] font-bold text-slate-900 leading-none">Enterprise Pro</h2>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Project Alpha
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 p-3 overflow-y-auto">
          <p className="mb-1 px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Operations
          </p>
          {NAV_ITEMS.map(({ label, to, icon: Icon }) => {
            const isActive =
              Boolean(to) &&
              (location.pathname === to || location.pathname.startsWith(to + '/'));
            if (!to) {
              return (
                <button
                  key={label}
                  type="button"
                  className="flex w-full cursor-default items-center gap-3 rounded-md px-3 py-2 text-[14px] font-medium text-slate-400"
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {label}
                </button>
              );
            }

            return (
              <Link
                key={label}
                to={to}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-[14px] font-medium transition-colors ${
                  isActive
                    ? 'bg-[#E2E8F0] text-[#002b85]'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {label}
              </Link>
            );
          })}

          <p className="mt-6 mb-1 px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Resources
          </p>
          {RESOURCE_ITEMS.map(({ label, to, icon: Icon }) => (
            to ? (
              <Link
                key={label}
                to={to}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-[14px] font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ) : (
              <button
                key={label}
                type="button"
                className="flex w-full cursor-default items-center gap-3 rounded-md px-3 py-2 text-[14px] font-medium text-slate-400"
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            )
          ))}

          <button
            id="sidebar-logout"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-[14px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* Top Header */}
        <header className="flex min-h-16 flex-col gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:h-16 lg:flex-shrink-0 lg:py-0">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#002b85] text-sm font-bold text-white">
              E
            </div>
            <div>
              <h2 className="text-[14px] font-bold leading-none text-slate-900">
                Enterprise Pro
              </h2>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Project Alpha
              </p>
            </div>
          </div>
          <div className="hidden lg:block" />
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-6">
            <div className="relative hidden items-center md:flex">
              <Search className="absolute left-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects..."
                className="w-[240px] rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-4 text-[13px] outline-none transition-all focus:border-[#002b85] focus:ring-1 focus:ring-[#002b85] xl:w-[300px]"
              />
            </div>
            <div className="flex items-center gap-3 text-slate-500 sm:gap-4">
              <Bell className="h-5 w-5 cursor-pointer hover:text-slate-900" />
              <Settings className="h-5 w-5 cursor-pointer hover:text-slate-900" />
              <HelpCircle className="h-5 w-5 cursor-pointer hover:text-slate-900" />
            </div>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-3 sm:pl-6">
              <div
                title={user ? `${user.firstName} ${user.lastName}` : ''}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E2E8F0] text-[13px] font-bold text-slate-700 cursor-default"
              >
                {userInitials}
              </div>
              <button
                onClick={handleLogout}
                title="Sign out"
                className="text-slate-500 hover:text-slate-900 transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        <nav className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-[#F8FAFC] px-4 py-2 lg:hidden">
          {NAV_ITEMS.filter((item) => item.to).map(({ label, to, icon: Icon }) => {
            const isActive =
              Boolean(to) &&
              (location.pathname === to ||
                location.pathname.startsWith(`${to}/`));
            return (
              <Link
                key={label}
                to={to as DashboardPath}
                className={`flex h-8 flex-shrink-0 items-center gap-2 rounded border px-3 text-[13px] font-medium ${
                  isActive
                    ? 'border-[#002b85] bg-white text-[#002b85]'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
