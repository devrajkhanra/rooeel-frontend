import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Check, X } from 'lucide-react';
import { formatDate } from '@/utils/format';
import { useApproveRequest, useRejectRequest } from '@/hooks/useRequests';
import type { UserRequest, RequestType } from '@/types/api.types';

interface AdminRequestsTableProps {
    requests: UserRequest[];
}

const REQUEST_TYPE_LABELS: Record<RequestType, string> = {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    password: 'Password',
};

const getStatusVariant = (status: string): 'default' | 'success' | 'warning' | 'danger' => {
    switch (status) {
        case 'approved':
            return 'success';
        case 'rejected':
            return 'danger';
        case 'pending':
            return 'warning';
        default:
            return 'default';
    }
};

export const AdminRequestsTable: React.FC<AdminRequestsTableProps> = ({ requests }) => {
    const approveRequest = useApproveRequest();
    const rejectRequest = useRejectRequest();
    const [processingId, setProcessingId] = useState<number | null>(null);

    const handleApprove = async (id: number, requestType: string) => {
        if (requestType === 'password') {
            alert('Password change requests cannot be approved by admins for security reasons.');
            return;
        }

        if (window.confirm('Are you sure you want to approve this request?')) {
            try {
                setProcessingId(id);
                await approveRequest.mutateAsync(id);
            } catch (err: any) {
                alert(err?.response?.data?.message || 'Failed to approve request');
            } finally {
                setProcessingId(null);
            }
        }
    };

    const handleReject = async (id: number) => {
        if (window.confirm('Are you sure you want to reject this request?')) {
            try {
                setProcessingId(id);
                await rejectRequest.mutateAsync(id);
            } catch (err: any) {
                alert(err?.response?.data?.message || 'Failed to reject request');
            } finally {
                setProcessingId(null);
            }
        }
    };

    if (requests.length === 0) {
        return (
            <div className="text-center py-12 text-[var(--color-text-secondary)]">
                <p>No pending requests from your users.</p>
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Current Value</TableHead>
                    <TableHead>Requested Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {requests.map((request) => {
                    const isPending = request.status === 'pending';
                    const isPasswordRequest = request.requestType === 'password';
                    const isProcessing = processingId === request.id;

                    return (
                        <TableRow key={request.id}>
                            <TableCell className="font-medium text-[var(--color-text-secondary)]">
                                #{request.id}
                            </TableCell>
                            <TableCell className="text-[var(--color-text-secondary)]">
                                #{request.userId}
                            </TableCell>
                            <TableCell>
                                <span className="font-medium">
                                    {REQUEST_TYPE_LABELS[request.requestType]}
                                </span>
                            </TableCell>
                            <TableCell className="text-[var(--color-text-secondary)]">
                                {request.currentValue || '-'}
                            </TableCell>
                            <TableCell className="text-[var(--color-text-secondary)]">
                                {request.requestedValue}
                            </TableCell>
                            <TableCell>
                                <Badge variant={getStatusVariant(request.status)}>
                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-[var(--color-text-secondary)]">
                                {formatDate(request.createdAt)}
                            </TableCell>
                            <TableCell className="text-right">
                                {isPending && (
                                    <div className="flex gap-2 justify-end">
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            leftIcon={<Check className="h-4 w-4" />}
                                            onClick={() => handleApprove(request.id, request.requestType)}
                                            isLoading={isProcessing && approveRequest.isPending}
                                            disabled={isProcessing || isPasswordRequest}
                                            title={isPasswordRequest ? 'Password requests cannot be approved' : 'Approve request'}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            leftIcon={<X className="h-4 w-4" />}
                                            onClick={() => handleReject(request.id)}
                                            isLoading={isProcessing && rejectRequest.isPending}
                                            disabled={isProcessing}
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                )}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};
