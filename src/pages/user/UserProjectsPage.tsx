import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { ProjectList } from '@/components/project/ProjectList';
import type { Project, ProjectStatus } from '@/types/api.types';

const STATUS_VARIANTS: Record<ProjectStatus, 'success' | 'warning' | 'default'> = {
    active: 'success',
    inactive: 'warning',
    completed: 'default',
};

export const UserProjectsPage: React.FC = () => {
    const { data: projects, isLoading, error } = useProjects();
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
                <h1 className="text-3xl font-bold mb-2">My Projects</h1>
                <p className="text-[var(--color-text-secondary)]">
                    Projects you're assigned to
                </p>
            </div>

            {/* Project Details Modal */}
            {selectedProject && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[var(--color-bg-primary)] rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-[var(--color-border)] animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-[var(--color-border)]">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-2xl font-semibold">{selectedProject.name}</h2>
                                        <Badge variant={STATUS_VARIANTS[selectedProject.status]}>
                                            {selectedProject.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        Project Details
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors p-2 hover:bg-[var(--color-bg-secondary)] rounded-lg"
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
                                    <p className="text-[var(--color-text-primary)] leading-relaxed">
                                        {selectedProject.description}
                                    </p>
                                </div>
                            )}

                            {selectedProject.users && selectedProject.users.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-3">
                                        Team Members ({selectedProject.users.length})
                                    </h3>
                                    <div className="space-y-2">
                                        {selectedProject.users.map((user) => (
                                            <div
                                                key={user.id}
                                                className="p-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]"
                                            >
                                                <p className="font-medium">
                                                    {user.firstName} {user.lastName}
                                                </p>
                                                <p className="text-xs text-[var(--color-text-secondary)]">
                                                    {user.email}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedProject.admin && (
                                <div>
                                    <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-2">
                                        Project Owner
                                    </h3>
                                    <div className="p-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                                        <p className="font-medium">
                                            {selectedProject.admin.firstName} {selectedProject.admin.lastName}
                                        </p>
                                        <p className="text-xs text-[var(--color-text-secondary)]">
                                            {selectedProject.admin.email}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div>
                                <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-2">
                                    Created
                                </h3>
                                <p className="text-[var(--color-text-primary)]">
                                    {new Date(selectedProject.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Projects Grid */}
            <ProjectList
                projects={projects || []}
                onProjectClick={setSelectedProject}
                emptyMessage="You haven't been assigned to any projects yet."
            />
        </div>
    );
};
