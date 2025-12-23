import React, { useState } from 'react';
import { useMyRequests } from '@/hooks/useRequests';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Plus, ChevronUp } from 'lucide-react';
import { RequestForm } from '@/components/user/RequestForm';
import { MyRequestsTable } from '@/components/user/MyRequestsTable';
import { UserDataDebugger } from '@/components/UserDataDebugger';

export const MyRequestsPage: React.FC = () => {
    const { data: requests, isLoading, error } = useMyRequests();
    const [showCreateForm, setShowCreateForm] = useState(false);

    const handleCreateSuccess = () => {
        setShowCreateForm(false);
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="mb-6">
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="py-8 text-center">
                        <p className="text-[var(--color-error)]">Failed to load requests</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold mb-1">My Requests</h1>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        Request changes to your profile information
                    </p>
                </div>
                <Button
                    variant="primary"
                    leftIcon={<Plus className="h-4 w-4" />}
                    onClick={() => setShowCreateForm(!showCreateForm)}
                >
                    New Request
                </Button>
            </div>

            {/* Create Request Form */}
            {showCreateForm && (
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Create Change Request</h2>
                            <button
                                onClick={() => setShowCreateForm(false)}
                                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                            >
                                <ChevronUp className="h-5 w-5" />
                            </button>
                        </div>
                        <RequestForm onSuccess={handleCreateSuccess} />
                    </CardContent>
                </Card>
            )}

            {/* Requests Table */}
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Request History</h2>
                    <MyRequestsTable requests={requests || []} />
                </CardContent>
            </Card>

            {/* Debugging Tools */}
            <UserDataDebugger />
        </div>
    );
};
