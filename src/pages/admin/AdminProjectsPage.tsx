import React, { useState } from 'react';
import { Plus, Edit, Trash2, UserPlus, X } from 'lucide-react';
import { useProjects, useDeleteProject, useRemoveUser } from '@/hooks/useProjects';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { ProjectList } from '@/components/project/ProjectList';
import { ProjectForm } from '@/components/project/ProjectForm';
import { UserAssignmentModal } from '@/components/project/UserAssignmentModal';
import type { Project } from '@/types/api.types';

export const AdminProjectsPage: React.FC = () => {
    const { data: projects, isLoading, error } = useProjects();
    const deleteProject = useDeleteProject();
    const removeUser = useRemoveUser();

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [assigningProject, setAssigningProject] = useState<Project | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const handleDelete = async (projectId: number) => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        try {
            await deleteProject.mutateAsync(projectId);
        } catch (err) {
            alert('Failed to delete project');
        }
    };

    const handleRemoveUser = async (projectId: number, userId: number) => {
        if (!confirm('Are you sure you want to remove this user from the project?')) return;
        try {
            await removeUser.mutateAsync({ projectId, userId });
        } catch (err) {
            alert('Failed to remove user');
        }
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <Skeleton className="h-8 w-48 mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-40" />
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
                        <p className="text-[var(--color-error)]">Failed to load projects</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold mb-1">Projects</h1>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        Manage your projects and assign users
                    </p>
                </div>
                <Button
                    variant="primary"
                    leftIcon={<Plus className="h-4 w-4" />}
                    onClick={() => setShowCreateForm(true)}
                >
                    New Project
                </Button>
            </div>

            {/* Create/Edit Form Modal */}
            {(showCreateForm || editingProject) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[var(--color-bg-primary)] rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">
                                    {editingProject ? 'Edit Project' : 'Create New Project'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowCreateForm(false);
                                        setEditingProject(null);
                                    }}
                                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <ProjectForm
                                project={editingProject || undefined}
                                onSuccess={() => {
                                    setShowCreateForm(false);
                                    setEditingProject(null);
                                }}
                                onCancel={() => {
                                    setShowCreateForm(false);
                                    setEditingProject(null);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* User Assignment Modal */}
            {assigningProject && (
                <UserAssignmentModal
                    project={assigningProject}
                    onClose={() => setAssigningProject(null)}
                    onSuccess={() => setAssigningProject(null)}
                />
            )}

            {/* Project Details Modal */}
            {selectedProject && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[var(--color-bg-primary)] rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">{selectedProject.name}</h2>
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {selectedProject.description && (
                                <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                                    {selectedProject.description}
                                </p>
                            )}

                            <div className="mb-4">
                                <h3 className="text-sm font-medium mb-2">Assigned Users</h3>
                                {selectedProject.users && selectedProject.users.length > 0 ? (
                                    <div className="space-y-2">
                                        {selectedProject.users.map((user) => (
                                            <div
                                                key={user.id}
                                                className="flex items-center justify-between p-2 rounded bg-[var(--color-bg-secondary)]"
                                            >
                                                <span className="text-sm">
                                                    {user.firstName} {user.lastName} ({user.email})
                                                </span>
                                                <button
                                                    onClick={() => handleRemoveUser(selectedProject.id, user.id)}
                                                    className="text-[var(--color-error)] hover:text-[var(--color-error)]/80"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-[var(--color-text-secondary)]">No users assigned</p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    leftIcon={<UserPlus className="h-4 w-4" />}
                                    onClick={() => {
                                        setAssigningProject(selectedProject);
                                        setSelectedProject(null);
                                    }}
                                >
                                    Assign User
                                </Button>
                                <Button
                                    variant="outline"
                                    leftIcon={<Edit className="h-4 w-4" />}
                                    onClick={() => {
                                        setEditingProject(selectedProject);
                                        setSelectedProject(null);
                                    }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="outline"
                                    leftIcon={<Trash2 className="h-4 w-4" />}
                                    onClick={() => {
                                        handleDelete(selectedProject.id);
                                        setSelectedProject(null);
                                    }}
                                    className="text-[var(--color-error)] hover:text-[var(--color-error)]/80"
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Projects Grid */}
            <ProjectList
                projects={projects || []}
                onProjectClick={setSelectedProject}
                emptyMessage="No projects yet. Create your first project to get started!"
            />
        </div>
    );
};
