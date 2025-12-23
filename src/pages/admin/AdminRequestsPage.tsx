import React, { useState } from 'react';
import { useAdminRequests } from '@/hooks/useRequests';
import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { AdminRequestsTable } from '@/components/admin/AdminRequestsTable';
import type { RequestStatus } from '@/types/api.types';

export const AdminRequestsPage: React.FC = () => {
    const { data: requests, isLoading, error } = useAdminRequests();
    const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('pending');

    const filteredRequests = requests?.filter(request =>
        statusFilter === 'all' || request.status === statusFilter
    ) || [];

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
            <div className="mb-6">
                <h1 className="text-2xl font-semibold mb-1">User Requests</h1>
                <p className="text-sm text-[var(--color-text-secondary)]">
                    Review and manage change requests from your users
                </p>
            </div>

            {/* Status Filter */}
            <Card className="mb-6">
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium">Filter by status:</label>
                        <div className="flex gap-2">
                            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${statusFilter === status
                                            ? 'bg-[var(--color-primary)] text-white'
                                            : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]'
                                        }`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                    {status !== 'all' && (
                                        <span className="ml-2 text-xs opacity-75">
                                            ({requests?.filter(r => r.status === status).length || 0})
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Requests Table */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">
                            {statusFilter === 'all' ? 'All Requests' : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Requests`}
                        </h2>
                        <span className="text-sm text-[var(--color-text-secondary)]">
                            {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                    <AdminRequestsTable requests={filteredRequests} />
                </CardContent>
            </Card>
        </div>
    );
};
