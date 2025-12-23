import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, FileText, ClipboardList, Folder } from 'lucide-react';
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
        icon: <Home className="h-5 w-5" />,
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
        <aside
            className="fixed left-0 top-0 h-screen w-16 bg-[var(--color-sidebar)] border-r border-[var(--color-border)] z-50"
        >
            <div className="flex flex-col h-full">
                {/* Logo/Brand */}
                <div className="h-14 flex items-center justify-center border-b border-[var(--color-border)]">
                    <div className="w-8 h-8 rounded-md bg-[var(--color-primary)] flex items-center justify-center">
                        <span className="text-black font-bold text-sm">R</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4">
                    {visibleItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            title={item.label}
                            className={cn(
                                'flex items-center justify-center h-12 mx-2 mb-1 rounded-md transition-all duration-200',
                                'hover:bg-[var(--color-surface-hover)]',
                                isActive(item.path)
                                    ? 'text-[var(--color-primary)] bg-[var(--color-surface-hover)] border-l-2 border-[var(--color-primary)]'
                                    : 'text-[var(--color-text-secondary)]'
                            )}
                        >
                            {item.icon}
                        </Link>
                    ))}
                </nav>
            </div>
        </aside>
    );
};
