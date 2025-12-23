import React from 'react';
import { Calendar, User, Users } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { Project, ProjectStatus } from '@/types/api.types';

interface ProjectCardProps {
    project: Project;
    onClick?: () => void;
}

const STATUS_VARIANTS: Record<ProjectStatus, 'success' | 'warning' | 'default'> = {
    active: 'success',
    inactive: 'warning',
    completed: 'default',
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-colors ${onClick ? 'cursor-pointer' : ''
                }`}
        >
            <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                    {project.name}
                </h3>
                <Badge variant={STATUS_VARIANTS[project.status]}>
                    {project.status}
                </Badge>
            </div>

            {project.description && (
                <p className="text-sm text-[var(--color-text-secondary)] mb-3 line-clamp-2">
                    {project.description}
                </p>
            )}

            <div className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)]">
                <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
                {project.users && project.users.length > 0 && (
                    <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{project.users.length} user{project.users.length !== 1 ? 's' : ''}</span>
                    </div>
                )}
                {project.admin && (
                    <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{project.admin.firstName} {project.admin.lastName}</span>
                    </div>
                )}
            </div>
        </div>
    );
};
