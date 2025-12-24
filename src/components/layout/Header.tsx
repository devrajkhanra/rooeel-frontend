import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, ChevronDown, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { Breadcrumbs, type BreadcrumbItem } from '@/components/ui/Breadcrumbs';

const getBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Map routes to breadcrumb labels
    const routeLabels: Record<string, string> = {
        dashboard: 'Dashboard',
        users: 'Users',
        'my-requests': 'My Requests',
        projects: 'My Projects',
        admin: 'Admin',
        requests: 'Requests',
    };

    paths.forEach((path, index) => {
        const href = '/' + paths.slice(0, index + 1).join('/');
        const label = routeLabels[path] || path.charAt(0).toUpperCase() + path.slice(1);
        breadcrumbs.push({ label, href });
    });

    return breadcrumbs;
};

export const Header: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [showUserMenu, setShowUserMenu] = React.useState(false);

    const breadcrumbs = getBreadcrumbs(location.pathname);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="h-14 border-b border-[var(--color-border)] bg-[var(--color-surface)] sticky top-0 z-40">
            <div className="h-full px-6 flex items-center justify-between">
                {/* Breadcrumbs */}
                <div className="flex-1">
                    {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-md hover:bg-[var(--color-surface-hover)] transition-colors"
                        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {theme === 'dark' ? (
                            <Sun className="h-5 w-5 text-[var(--color-text-secondary)]" />
                        ) : (
                            <Moon className="h-5 w-5 text-[var(--color-text-secondary)]" />
                        )}
                    </button>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-[var(--color-surface-hover)] transition-colors"
                        >
                            <div className="w-7 h-7 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                                <User className="h-4 w-4 text-black" />
                            </div>
                            <span className="text-sm font-medium hidden sm:inline">
                                {user?.email}
                            </span>
                            <ChevronDown className="h-4 w-4 text-[var(--color-text-tertiary)]" />
                        </button>

                        {/* Dropdown Menu */}
                        {showUserMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowUserMenu(false)}
                                />
                                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg z-20 animate-slide-down">
                                    <div className="p-3 border-b border-[var(--color-border)]">
                                        <p className="text-sm font-medium">{user?.email}</p>
                                        <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5 capitalize">
                                            {user?.role}
                                        </p>
                                    </div>
                                    <div className="p-1">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-[var(--color-surface-hover)] transition-colors text-left"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            <span>Sign out</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
