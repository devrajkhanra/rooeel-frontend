import React, { useState } from 'react';
import { useUsers, useDeleteUser } from '@/hooks/useUsers';
import { useProjects, useSetUserDesignation, useRemoveUserDesignation } from '@/hooks/useProjects';
import { useDesignations } from '@/hooks/useDesignations';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Trash2, UserPlus, ChevronUp, Briefcase, ChevronDown, ChevronRight, X } from 'lucide-react';
import { formatDate, formatName } from '@/utils/format';
import { CreateUserForm } from '@/components/admin/CreateUserForm';
import type { User, Project } from '@/types/api.types';

export const UserListPage: React.FC = () => {
    const { user: currentUser } = useAuth();
    const { data: users, isLoading: usersLoading, error: usersError } = useUsers();
    const { data: projects, isLoading: projectsLoading } = useProjects();
    const { data: allDesignations } = useDesignations();
    const deleteUser = useDeleteUser();
    const setUserDesignation = useSetUserDesignation();
    const removeUserDesignation = useRemoveUserDesignation();
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [expandedUserId, setExpandedUserId] = useState<number | null>(null);

    const isAdmin = currentUser?.role === 'admin';

    // Helper function to get projects a user is assigned to
    const getUserProjects = (userId: number): Project[] => {
        if (!projects) return [];
        return projects.filter(project =>
            project.users?.some(pu => pu.userId === userId)
        );
    };

    // Helper function to get unique designations for a user across all projects
    const getUserDesignations = (userId: number): string[] => {
        if (!projects) return [];
        const designations = new Set<string>();
        projects.forEach(project => {
            project.users?.forEach(pu => {
                if (pu.userId === userId && pu.designation) {
                    designations.add(pu.designation.name);
                }
            });
        });
        return Array.from(designations);
    };

    // Get user's designation for a specific project
    const getUserDesignationInProject = (userId: number, projectId: number) => {
        const project = projects?.find(p => p.id === projectId);
        const projectUser = project?.users?.find(pu => pu.userId === userId);
        return projectUser?.designation;
    };

    // Get available designations for a project (from all designations created by admin)
    const getAvailableDesignations = () => {
        return allDesignations || [];
    };

    const handleSetDesignation = async (projectId: number, userId: number, designationId: number) => {
        try {
            await setUserDesignation.mutateAsync({ projectId, userId, designationId });
        } catch (error) {
            alert('Failed to set designation');
        }
    };

    const handleRemoveDesignation = async (projectId: number, userId: number) => {
        try {
            await removeUserDesignation.mutateAsync({ projectId, userId });
        } catch (error) {
            alert('Failed to remove designation');
        }
    };

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

    const toggleExpand = (userId: number) => {
        setExpandedUserId(expandedUserId === userId ? null : userId);
    };

    const isLoading = usersLoading || projectsLoading;

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

    if (usersError) {
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
                                <ChevronUp className="h-5 w-5" />
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

            {/* User Table */}
            {users && users.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-sm text-[var(--color-text-secondary)]">
                            No users found. {isAdmin ? 'Create your first user above.' : 'Users can be created by admins.'}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Projects</TableHead>
                            <TableHead>Designations</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Status</TableHead>
                            {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users?.map((user: User) => {
                            const userProjects = getUserProjects(user.id);
                            const userDesignations = getUserDesignations(user.id);
                            const isExpanded = expandedUserId === user.id;

                            return (
                                <React.Fragment key={user.id}>
                                    <TableRow>
                                        <TableCell className="font-medium text-[var(--color-text-secondary)]">
                                            #{user.id}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium text-[var(--color-text-primary)]">
                                                {formatName(user.firstName, user.lastName)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-[var(--color-text-secondary)]">
                                            {user.email}
                                        </TableCell>
                                        <TableCell>
                                            {userProjects.length > 0 ? (
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="info" className="gap-1">
                                                        <Briefcase className="h-3 w-3" />
                                                        {userProjects.length} {userProjects.length === 1 ? 'Project' : 'Projects'}
                                                    </Badge>
                                                    {isAdmin && (
                                                        <button
                                                            onClick={() => toggleExpand(user.id)}
                                                            className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                                                            title={isExpanded ? 'Collapse' : 'Expand to manage designations'}
                                                        >
                                                            {isExpanded ? (
                                                                <ChevronDown className="h-4 w-4" />
                                                            ) : (
                                                                <ChevronRight className="h-4 w-4" />
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-[var(--color-text-secondary)]">Not Assigned</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {userDesignations.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {userDesignations.map((designation, index) => (
                                                        <Badge key={index} variant="secondary">
                                                            {designation}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-[var(--color-text-secondary)]">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-[var(--color-text-secondary)]">
                                            {formatDate(user.createdAt)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="success">Active</Badge>
                                        </TableCell>
                                        {isAdmin && (
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    leftIcon={<Trash2 className="h-4 w-4" />}
                                                    onClick={() => handleDelete(user.id)}
                                                    isLoading={deleteUser.isPending}
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        )}
                                    </TableRow>

                                    {/* Expanded Row - Project Designation Management */}
                                    {isExpanded && isAdmin && userProjects.length > 0 && (
                                        <TableRow className="bg-zinc-900/50">
                                            <TableCell colSpan={8} className="p-0">
                                                <div className="px-6 py-4 space-y-3">
                                                    <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
                                                        Manage Designations for {user.firstName}
                                                    </h4>
                                                    {userProjects.map((project) => {
                                                        const currentDesignation = getUserDesignationInProject(user.id, project.id);
                                                        const availableDesignations = getAvailableDesignations();

                                                        return (
                                                            <div
                                                                key={project.id}
                                                                className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-zinc-700"
                                                            >
                                                                <div className="flex-1">
                                                                    <p className="font-medium text-sm">{project.name}</p>
                                                                    <p className="text-xs text-[var(--color-text-secondary)]">
                                                                        {project.description || 'No description'}
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    {currentDesignation ? (
                                                                        <>
                                                                            <Badge variant="secondary">
                                                                                {currentDesignation.name}
                                                                            </Badge>
                                                                            <select
                                                                                value=""
                                                                                onChange={(e) => {
                                                                                    const designationId = Number(e.target.value);
                                                                                    if (designationId) {
                                                                                        handleSetDesignation(project.id, user.id, designationId);
                                                                                    }
                                                                                }}
                                                                                className="px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                                                                disabled={setUserDesignation.isPending}
                                                                            >
                                                                                <option value="">Change...</option>
                                                                                {availableDesignations
                                                                                    .filter(d => d.id !== currentDesignation.id)
                                                                                    .map((d) => (
                                                                                        <option key={d.id} value={d.id}>
                                                                                            {d.name}
                                                                                        </option>
                                                                                    ))}
                                                                            </select>
                                                                            <button
                                                                                onClick={() => handleRemoveDesignation(project.id, user.id)}
                                                                                className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-error)] transition-colors"
                                                                                title="Remove designation"
                                                                                disabled={removeUserDesignation.isPending}
                                                                            >
                                                                                <X className="h-4 w-4" />
                                                                            </button>
                                                                        </>
                                                                    ) : (
                                                                        <select
                                                                            value=""
                                                                            onChange={(e) => {
                                                                                const designationId = Number(e.target.value);
                                                                                if (designationId) {
                                                                                    handleSetDesignation(project.id, user.id, designationId);
                                                                                }
                                                                            }}
                                                                            className="px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                                                            disabled={setUserDesignation.isPending}
                                                                        >
                                                                            <option value="">Assign designation...</option>
                                                                            {availableDesignations.map((d) => (
                                                                                <option key={d.id} value={d.id}>
                                                                                    {d.name}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
            )}
        </div>
    );
};
