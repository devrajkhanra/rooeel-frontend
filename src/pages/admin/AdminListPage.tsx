import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
import { useAdmins, useDeleteAdmin } from '@/hooks/useAdmins';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate, formatName } from '@/utils/format';
import type { Admin } from '@/types/api.types';

export const AdminListPage: React.FC = () => {
    const navigate = useNavigate();
    const { data: admins, isLoading, error } = useAdmins();
    const deleteAdmin = useDeleteAdmin();
    const currentUser = authService.getCurrentUser();

    const handleDelete = async (id: number) => {
        // Prevent admin from deleting themselves
        if (currentUser && id === currentUser.id) {
            alert('You cannot delete your own account.');
            return;
        }

        if (window.confirm('Are you sure you want to delete this admin?')) {
            try {
                await deleteAdmin.mutateAsync(id);
            } catch (err) {
                alert('Failed to delete admin');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="container py-8">
                <div className="flex justify-between items-center mb-8">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-24 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-8">
                <Card>
                    <CardContent className="py-8 text-center">
                        <p className="text-[var(--color-error)]">Failed to load admins</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Admin Management</h1>
                <p className="text-[var(--color-text-secondary)]">
                    Manage administrator accounts. Admins can only be created through the signup process.
                </p>
            </div>

            {admins && admins.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-[var(--color-text-secondary)]">
                            No admins found. Admins can only be created through the signup process.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {admins?.map((admin: Admin) => (
                        <Card key={admin.id} className="hover:border-[var(--color-border-light)] transition-colors">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold">
                                                {formatName(admin.firstName, admin.lastName)}
                                            </h3>
                                            <Badge variant="success">Active</Badge>
                                        </div>
                                        <p className="text-sm text-[var(--color-text-secondary)] mb-1">
                                            {admin.email}
                                        </p>
                                        <p className="text-xs text-[var(--color-text-tertiary)]">
                                            Created {formatDate(admin.createdAt)}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            leftIcon={<Edit className="h-4 w-4" />}
                                            onClick={() => navigate(`/admin/${admin.id}/edit`)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            leftIcon={<Trash2 className="h-4 w-4" />}
                                            onClick={() => handleDelete(admin.id)}
                                            disabled={currentUser?.id === admin.id}
                                            isLoading={deleteAdmin.isPending}
                                            title={currentUser?.id === admin.id ? 'You cannot delete your own account' : ''}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
