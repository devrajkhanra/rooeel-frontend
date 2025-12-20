import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SidebarProps {
    isCollapsed: boolean;
    isMobileOpen: boolean;
    onToggleCollapse: () => void;
    onToggleMobile: () => void;
    onCloseMobile: () => void;
}

interface NavItem {
    label: string;
    icon: React.ReactNode;
    path: string;
}

const navItems: NavItem[] = [
    {
        label: 'Dashboard',
        icon: <Home className="h-5 w-5" />,
        path: '/dashboard',
    },
    {
        label: 'Admins',
        icon: <Users className="h-5 w-5" />,
        path: '/admin',
    },
];

export const Sidebar: React.FC<SidebarProps> = ({
    isCollapsed,
    isMobileOpen,
    onToggleCollapse,
    onToggleMobile,
    onCloseMobile,
}) => {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <>
            {/* Mobile overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onCloseMobile}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-[var(--color-surface)] border-r border-[var(--color-border)] transition-all duration-200 z-50',
                    // Desktop styles - always visible, width changes based on collapse state
                    'hidden md:block',
                    isCollapsed ? 'md:w-16' : 'md:w-60',
                    // Mobile styles - overlay when open
                    isMobileOpen && 'block w-60 md:hidden'
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Navigation */}
                    <nav className="flex-1 px-2 py-4 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={onCloseMobile}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                                    'hover:bg-[var(--color-surface-hover)]',
                                    isActive(item.path)
                                        ? 'bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 text-[var(--color-primary)] border-l-2 border-[var(--color-primary)]'
                                        : 'text-[var(--color-text-secondary)]'
                                )}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <span className="flex-shrink-0">{item.icon}</span>
                                {!isCollapsed && (
                                    <span className="font-medium text-sm">{item.label}</span>
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop toggle button */}
                    <div className="hidden md:block p-2 border-t border-[var(--color-border)]">
                        <button
                            onClick={onToggleCollapse}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors text-[var(--color-text-secondary)]"
                            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            {isCollapsed ? (
                                <ChevronRight className="h-5 w-5" />
                            ) : (
                                <>
                                    <ChevronLeft className="h-5 w-5" />
                                    <span className="text-sm font-medium">Collapse</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Mobile close button */}
                    <div className="md:hidden p-2 border-t border-[var(--color-border)]">
                        <button
                            onClick={onCloseMobile}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors text-[var(--color-text-secondary)]"
                        >
                            <X className="h-5 w-5" />
                            <span className="text-sm font-medium">Close</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile menu button */}
            <button
                onClick={onToggleMobile}
                className="md:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-lg hover:shadow-xl transition-all z-40 flex items-center justify-center"
                aria-label="Toggle menu"
            >
                <Menu className="h-6 w-6" />
            </button>
        </>
    );
};
