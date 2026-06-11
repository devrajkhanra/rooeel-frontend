import { Link, Outlet } from '@tanstack/react-router';
import {
  LayoutDashboard,
  Folder,
  ShoppingCart,
  LineChart,
  HelpCircle,
  LogOut,
  Bell,
  Settings,
  HelpCircle as HelpIcon,
  LogOut as LogOutIcon,
  Search,
  Menu,
} from 'lucide-react';

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-[240px] flex-shrink-0 border-r border-slate-200 bg-[#F8FAFC] flex flex-col">
        {/* Branding */}
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-[#002b85] font-bold text-white">
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
        <nav className="flex-1 space-y-1 p-3">
          <div className="mb-2 px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Operations
          </div>
          <Link to="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-[14px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link to="/projects" className="flex items-center gap-3 rounded-md bg-[#E2E8F0] px-3 py-2 text-[14px] font-medium text-[#002b85] transition-colors">
            <Folder className="h-4 w-4" />
            Projects
          </Link>
          <Link to="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-[14px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <ShoppingCart className="h-4 w-4" />
            Procurement
          </Link>
          <Link to="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-[14px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <LineChart className="h-4 w-4" />
            Financials
          </Link>
          <Link to="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-[14px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <LineChart className="h-4 w-4" />
            Analytics
          </Link>

          <div className="mt-8 mb-2 px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Resources
          </div>
          <Link to="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-[14px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <HelpCircle className="h-4 w-4" />
            Support
          </Link>
          <Link to="/" className="flex items-center gap-3 rounded-md px-3 py-2 text-[14px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
          <div className="flex items-center gap-4 text-slate-500">
            <Menu className="h-5 w-5 cursor-pointer" />
          </div>
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
              <HelpIcon className="h-5 w-5 cursor-pointer hover:text-slate-900" />
            </div>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E2E8F0] text-[13px] font-bold text-slate-700">
                DK
              </div>
              <LogOutIcon className="h-5 w-5 cursor-pointer text-slate-500 hover:text-slate-900" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}