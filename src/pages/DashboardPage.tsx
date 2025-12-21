import React from 'react';
import { Home } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';

export const DashboardPage: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="container py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">
                    Welcome back, {user?.firstName}!
                </h1>
                <p className="text-[var(--color-text-secondary)]">
                    Manage your application from the dashboard
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="opacity-50">
                    <CardHeader>
                        <div className="h-12 w-12 rounded-lg bg-[var(--color-surface-hover)] flex items-center justify-center mb-4">
                            <Home className="h-6 w-6 text-[var(--color-text-tertiary)]" />
                        </div>
                        <CardTitle>More Features</CardTitle>
                        <CardDescription>
                            Additional features coming soon
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
};
