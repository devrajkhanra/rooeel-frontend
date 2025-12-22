import React, { useState } from 'react';
import { useUsers, useDeleteUser } from '@/hooks/useUsers';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Trash2, Mail, UserPlus, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDate, formatName } from '@/utils/format';
import { CreateUserForm } from '@/components/admin/CreateUserForm';
import type { User } from '@/types/api.types';

export const UserListPage: React.FC = () => {
    const { user: currentUser } = useAuth();
    const { data: users, isLoading, error } = useUsers();
    const deleteUser = useDeleteUser();
    const [showCreateForm, setShowCreateForm] = useState(false);

    const isAdmin = currentUser?.role === 'admin';

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser.mutateAsync(id);
            } catch (err) {
                alert('Failed to delete user');
            }
        }
    };

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
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="py-8 text-center">
                        <p className="text-[var(--color-error)]">Failed to load users</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold mb-1">Users</h1>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        Manage user accounts
                    </p>
                </div>
                {isAdmin && (
                    <Button
                        variant="primary"
                        leftIcon={<UserPlus className="h-4 w-4" />}
                        onClick={() => setShowCreateForm(!showCreateForm)}
                    >
                        Create User
                    </Button>
                )}
            </div>

            {/* Create User Form - Admin Only */}
            {isAdmin && showCreateForm && (
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Create New User</h2>
                            <button
                                onClick={() => setShowCreateForm(false)}
                                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                            >
                                {showCreateForm ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                            </button>
                        </div>
                        <div className="p-4 rounded-md bg-[var(--color-info)]/10 border border-[var(--color-info)]/20 mb-4">
                            <p className="text-xs text-[var(--color-text-secondary)]">
                                <strong>Note:</strong> Users cannot self-register. Only admins can create user accounts.
                            </p>
                        </div>
                        <CreateUserForm onSuccess={handleCreateSuccess} />
                    </CardContent>
                </Card>
            )}

            {/* User List */}
            {users && users.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-sm text-[var(--color-text-secondary)]">
                            No users found. {isAdmin ? 'Create your first user above.' : 'Users can be created by admins.'}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {users?.map((user: User) => (
                        <Card key={user.id} className="hover:border-[var(--color-border-light)] transition-colors">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-sm font-semibold">
                                                {formatName(user.firstName, user.lastName)}
                                            </h3>
                                            <Badge variant="success">Active</Badge>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                                            <Mail className="h-3 w-3" />
                                            <span>{user.email}</span>
                                        </div>
                                        <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                                            Created {formatDate(user.createdAt)}
                                        </p>
                                    </div>
                                    {isAdmin && (
                                        <div className="flex gap-2">
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                leftIcon={<Trash2 className="h-4 w-4" />}
                                                onClick={() => handleDelete(user.id)}
                                                isLoading={deleteUser.isPending}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
