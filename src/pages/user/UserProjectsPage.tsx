import React, { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { ProjectList } from '@/components/project/ProjectList';
import { X } from 'lucide-react';
import type { Project } from '@/types/api.types';

export const UserProjectsPage: React.FC = () => {
    const { data: projects, isLoading, error } = useProjects();
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
            <div className="mb-6">
                <h1 className="text-2xl font-semibold mb-1">My Projects</h1>
                <p className="text-sm text-[var(--color-text-secondary)]">
                    Projects you're assigned to
                </p>
            </div>

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
                                <div className="mb-4">
                                    <h3 className="text-sm font-medium mb-2">Description</h3>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        {selectedProject.description}
                                    </p>
                                </div>
                            )}

                            <div className="mb-4">
                                <h3 className="text-sm font-medium mb-2">Status</h3>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20">
                                    {selectedProject.status}
                                </span>
                            </div>

                            {selectedProject.users && selectedProject.users.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="text-sm font-medium mb-2">Team Members</h3>
                                    <div className="space-y-2">
                                        {selectedProject.users.map((user) => (
                                            <div
                                                key={user.id}
                                                className="p-2 rounded bg-[var(--color-bg-secondary)] text-sm"
                                            >
                                                {user.firstName} {user.lastName} ({user.email})
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedProject.admin && (
                                <div>
                                    <h3 className="text-sm font-medium mb-2">Project Owner</h3>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        {selectedProject.admin.firstName} {selectedProject.admin.lastName}
                                    </p>
                                </div>
                            )}
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
