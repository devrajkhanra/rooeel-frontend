import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, FileText, ClipboardList, Folder, LayoutDashboard, X } from 'lucide-react';
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

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
    const location = useLocation();
    const { user } = useAuth();

    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    const visibleItems = navItems.filter(item =>
        !item.roles || (user?.role && item.roles.includes(user.role))
    );

    const handleLinkClick = () => {
        if (onClose) {
            onClose();
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed left-0 top-0 h-screen bg-[var(--color-sidebar)] border-r border-[var(--color-border)] z-50 flex flex-col transition-transform duration-300",
                // Mobile: full width sidebar that slides in
                "w-64 md:w-16",
                isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                {/* Logo */}
                <div className="h-14 flex items-center justify-between px-4 md:justify-center border-b border-[var(--color-border)]">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
                            <span className="text-black font-bold text-base">R</span>
                        </div>
                        <span className="font-bold text-lg md:hidden">Rooeel</span>
                    </div>
                    {/* Close button for mobile */}
                    <button
                        onClick={onClose}
                        className="md:hidden p-2 hover:bg-[var(--color-surface-hover)] rounded-lg"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 space-y-1">
                    {visibleItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={handleLinkClick}
                            title={item.label}
                            className={cn(
                                'group relative flex items-center h-11 mx-2 rounded-lg transition-all duration-200',
                                // Mobile: show full label
                                'px-3 gap-3 md:justify-center md:px-0 md:gap-0',
                                isActive(item.path)
                                    ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                                    : 'text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]'
                            )}
                        >
                            {item.icon}
                            <span className="md:hidden font-medium">{item.label}</span>

                            {/* Active Indicator */}
                            {isActive(item.path) && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--color-primary)] rounded-r-full" />
                            )}

                            {/* Tooltip for desktop */}
                            <div className="hidden md:block absolute left-full ml-2 px-2 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md text-xs font-medium whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                                {item.label}
                            </div>
                        </Link>
                    ))}
                </nav>
            </aside>
        </>
    );
};
