import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useSidebar } from '@/hooks/useSidebar';
import { cn } from '@/utils/cn';

export const AppLayout: React.FC = () => {
    const { isCollapsed, isMobileOpen, toggleCollapse, toggleMobile, closeMobile } = useSidebar();

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex flex-1">
                <Sidebar
                    isCollapsed={isCollapsed}
                    isMobileOpen={isMobileOpen}
                    onToggleCollapse={toggleCollapse}
                    onToggleMobile={toggleMobile}
                    onCloseMobile={closeMobile}
                />
                <main
                    className={cn(
                        'flex-1 transition-all duration-200',
                        // Desktop: account for sidebar width
                        'md:ml-0',
                        isCollapsed ? 'md:ml-16' : 'md:ml-60'
                    )}
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
