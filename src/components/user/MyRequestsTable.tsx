import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/utils/format';
import type { UserRequest, RequestType } from '@/types/api.types';

interface MyRequestsTableProps {
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

export const MyRequestsTable: React.FC<MyRequestsTableProps> = ({ requests }) => {
    if (requests.length === 0) {
        return (
            <div className="text-center py-12 text-[var(--color-text-secondary)]">
                <p>No requests found. Create your first request above.</p>
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Current Value</TableHead>
                    <TableHead>Requested Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {requests.map((request) => (
                    <TableRow key={request.id}>
                        <TableCell className="font-medium text-[var(--color-text-secondary)]">
                            #{request.id}
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
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
