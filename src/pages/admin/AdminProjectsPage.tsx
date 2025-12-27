import React, { useState } from 'react';
import { Plus, Edit, Trash2, UserPlus, X } from 'lucide-react';
import { useProjects, useDeleteProject, useRemoveUser } from '@/hooks/useProjects';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { ProjectList } from '@/components/project/ProjectList';
import { ProjectForm } from '@/components/project/ProjectForm';
import { UserAssignmentModal } from '@/components/project/UserAssignmentModal';
import { showToast } from '@/utils/toast';
import type { Project } from '@/types/api.types';

export const AdminProjectsPage: React.FC = () => {
    const { data: projects, isLoading, error } = useProjects();
    const deleteProject = useDeleteProject();
    const removeUser = useRemoveUser();

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [assigningProject, setAssigningProject] = useState<Project | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const handleDelete = async (projectId: number, projectName: string) => {
        try {
            await deleteProject.mutateAsync(projectId);
            showToast.success(`Project "${projectName}" deleted successfully`);
        } catch (err: any) {
            showToast.error(err?.response?.data?.message || 'Failed to delete project');
        }
    };

    const handleRemoveUser = async (projectId: number, userId: number, userName: string) => {
        try {
            await removeUser.mutateAsync({ projectId, userId });
            showToast.success(`${userName} removed from project`);

            // Optimistically update the selectedProject state to immediately reflect the change
            if (selectedProject && selectedProject.id === projectId) {
                setSelectedProject({
                    ...selectedProject,
                    users: selectedProject.users?.filter(pu => pu.userId !== userId)
                });
            }
        } catch (err: any) {
            showToast.error(err?.response?.data?.message || 'Failed to remove user');
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                <Skeleton className="h-10 w-64 mb-2" />
                <Skeleton className="h-5 w-96 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-48 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                <Card className="border-[var(--color-error)]/20">
                    <CardContent className="py-12 text-center">
                        <p className="text-[var(--color-error)] text-lg">Failed to load projects</p>
                        <p className="text-sm text-[var(--color-text-secondary)] mt-2">
                            Please try refreshing the page
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Projects</h1>
                        <p className="text-[var(--color-text-secondary)]">
                            Manage your projects and assign team members
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        leftIcon={<Plus className="h-4 w-4" />}
                        onClick={() => setShowCreateForm(true)}
                        className="shadow-sm hover:shadow-md transition-shadow"
                    >
                        New Project
                    </Button>
                </div>
            </div>

            {/* Create/Edit Form Modal */}
            {(showCreateForm || editingProject) && (
                <div className="fixed inset-0 bg-black/70 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[var(--color-surface)] rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-[var(--color-border)] animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-[var(--color-border)]">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-semibold">
                                    {editingProject ? 'Edit Project' : 'Create New Project'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowCreateForm(false);
                                        setEditingProject(null);
                                    }}
                                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors p-2 hover:bg-[var(--color-bg-secondary)] rounded-lg"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
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
                <div className="fixed inset-0 bg-black/70 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[var(--color-surface)] rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-[var(--color-border)] animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-[var(--color-border)]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-semibold">{selectedProject.name}</h2>
                                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                                        Project Details
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors p-2 hover:bg-[var(--color-surface-hover)] rounded-lg"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)] space-y-6">
                            {selectedProject.description && (
                                <div>
                                    <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-2">
                                        Description
                                    </h3>
                                    <p className="text-[var(--color-text)]">
                                        {selectedProject.description}
                                    </p>
                                </div>
                            )}

                            <div>
                                <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-3">
                                    Team Members ({selectedProject.users?.length || 0})
                                </h3>
                                {selectedProject.users && selectedProject.users.length > 0 ? (
                                    <div className="space-y-2">
                                        {selectedProject.users.map((projectUser) => {
                                            const user = projectUser.user;
                                            if (!user) return null;

                                            return (
                                                <div
                                                    key={projectUser.id}
                                                    className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-surface-hover)] hover:bg-[var(--color-border)] transition-colors border border-[var(--color-border)]"
                                                >
                                                    <div>
                                                        <p className="font-medium text-[var(--color-text)]">
                                                            {user.firstName} {user.lastName}
                                                        </p>
                                                        <p className="text-xs text-[var(--color-text-secondary)]">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveUser(selectedProject.id, user.id, `${user.firstName} ${user.lastName}`)}
                                                        className="text-[var(--color-error)] hover:bg-[var(--color-error)]/10 p-2 rounded-lg transition-colors"
                                                        title="Remove user"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-[var(--color-surface-hover)] rounded-lg border border-dashed border-[var(--color-border)]">
                                        <p className="text-[var(--color-text-secondary)]">No team members assigned yet</p>
                                        <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                                            Click "Assign User" to add team members
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-surface-hover)]">
                            <div className="flex gap-3">
                                <Button
                                    variant="primary"
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
                                    Edit Project
                                </Button>
                                <Button
                                    variant="outline"
                                    leftIcon={<Trash2 className="h-4 w-4" />}
                                    onClick={() => {
                                        handleDelete(selectedProject.id, selectedProject.name);
                                        setSelectedProject(null);
                                    }}
                                    className="text-[var(--color-error)] border-[var(--color-error)]/20 hover:bg-[var(--color-error)]/10"
                                >
                                    Delete Project
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
