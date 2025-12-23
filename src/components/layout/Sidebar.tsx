import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, FileText, ClipboardList, Folder, LayoutDashboard } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/hooks/useAuth';

interface NavItem {
    label: string;
    icon: React.ReactNode;
    path: string;
    roles?: ('admin' | 'user')[];
}

const navItems: NavItem[] = [
    {
        label: 'Dashboard',
        icon: <LayoutDashboard className="h-5 w-5" />,
        path: '/dashboard',
    },
    {
        label: 'Users',
        icon: <Users className="h-5 w-5" />,
        path: '/users',
        roles: ['admin'],
    },
    {
        label: 'Projects',
        icon: <Folder className="h-5 w-5" />,
        path: '/admin/projects',
        roles: ['admin'],
    },
    {
        label: 'Requests',
        icon: <ClipboardList className="h-5 w-5" />,
        path: '/admin/requests',
        roles: ['admin'],
    },
    {
        label: 'My Projects',
        icon: <Folder className="h-5 w-5" />,
        path: '/projects',
        roles: ['user'],
    },
    {
        label: 'My Requests',
        icon: <FileText className="h-5 w-5" />,
        path: '/my-requests',
        roles: ['user'],
    },
];

export const Sidebar: React.FC = () => {
    const location = useLocation();
    const { user } = useAuth();

    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    const visibleItems = navItems.filter(item =>
        !item.roles || (user?.role && item.roles.includes(user.role))
    );

    return (
        <aside className="fixed left-0 top-0 h-screen w-16 bg-[var(--color-sidebar)] border-r border-[var(--color-border)] z-50 flex flex-col">
            {/* Logo */}
            <div className="h-14 flex items-center justify-center border-b border-[var(--color-border)]">
                <div className="w-9 h-9 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
                    <span className="text-black font-bold text-base">R</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 space-y-1">
                {visibleItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        title={item.label}
                        className={cn(
                            'group relative flex items-center justify-center h-11 mx-2 rounded-lg transition-all duration-200',
                            isActive(item.path)
                                ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                                : 'text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]'
                        )}
                    >
                        {item.icon}

                        {/* Active Indicator */}
                        {isActive(item.path) && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--color-primary)] rounded-r-full" />
                        )}

                        {/* Tooltip */}
                        <div className="absolute left-full ml-2 px-2 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md text-xs font-medium whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                            {item.label}
                        </div>
                    </Link>
                ))}
            </nav>
        </aside>
    );
};
