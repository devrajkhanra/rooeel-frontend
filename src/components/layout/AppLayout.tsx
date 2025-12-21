import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const AppLayout: React.FC = () => {
    return (
        <div className="min-h-screen flex">
            <Sidebar />
            <div className="flex-1 ml-16 flex flex-col">
                <Header />
                <main className="flex-1 bg-[var(--color-background)]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
