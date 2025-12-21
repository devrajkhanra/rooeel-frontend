import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';

export const DashboardPage: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold mb-1">
                    Welcome back, {user?.firstName}
                </h1>
                <p className="text-sm text-[var(--color-text-secondary)]">
                    Manage your application from the dashboard
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Getting Started</CardTitle>
                        <CardDescription>
                            Welcome to your dashboard. Start building your application.
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Documentation</CardTitle>
                        <CardDescription>
                            Learn how to use the platform with our comprehensive guides.
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Support</CardTitle>
                        <CardDescription>
                            Need help? Our support team is here to assist you.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
};
