import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const AppLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen flex">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 ml-0 md:ml-16 flex flex-col">
                <Header onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 bg-[var(--color-background)]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
