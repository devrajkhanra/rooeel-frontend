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
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { graphQLClient } from '../../lib/graphql-client';
import { LOGOUT_MUTATION } from '../../lib/graphql/auth.operations';

const NAV_ITEMS = [
  { label: 'Dashboard', to: '#', icon: LayoutDashboard },
  { label: 'Projects', to: '/projects', icon: Folder },
  { label: 'Procurement', to: '#', icon: ShoppingCart },
  { label: 'Financials', to: '#', icon: LineChart },
  { label: 'Analytics', to: '#', icon: LineChart },
];

const RESOURCE_ITEMS = [
  { label: 'Support', to: '#', icon: HelpCircle },
];

export function DashboardLayout() {
  const { user, refreshToken, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    if (refreshToken) {
      try {
        await graphQLClient.request(LOGOUT_MUTATION, { input: { refreshToken } });
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
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-[240px] flex-shrink-0 border-r border-slate-200 bg-[#F8FAFC] flex flex-col">
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
              to !== '#' &&
              (location.pathname === to || location.pathname.startsWith(to + '/'));
            return (
              <Link
                key={label}
                to={to as any}
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
            <Link
              key={label}
              to={to as any}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-[14px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
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
      <main className="flex flex-1 flex-col min-w-0">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 flex-shrink-0">
          <div />
          <div className="flex items-center gap-6">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects..."
                className="w-[300px] rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-4 text-[13px] outline-none transition-all focus:border-[#002b85] focus:ring-1 focus:ring-[#002b85]"
              />
            </div>
            <div className="flex items-center gap-4 text-slate-500">
              <Bell className="h-5 w-5 cursor-pointer hover:text-slate-900" />
              <Settings className="h-5 w-5 cursor-pointer hover:text-slate-900" />
              <HelpCircle className="h-5 w-5 cursor-pointer hover:text-slate-900" />
            </div>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
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

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}