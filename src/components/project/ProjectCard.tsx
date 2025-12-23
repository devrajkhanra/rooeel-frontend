import React from 'react';
import { Calendar, Users, User as UserIcon } from 'lucide-react';
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
            className={`group relative p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:border-[var(--color-primary)]/30 transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5' : ''
                }`}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                    {project.name}
                </h3>
                <Badge variant={STATUS_VARIANTS[project.status]} className="ml-2 flex-shrink-0">
                    {project.status}
                </Badge>
            </div>

            {/* Description */}
            {project.description && (
                <p className="text-sm text-[var(--color-text-secondary)] mb-4 line-clamp-2 leading-relaxed">
                    {project.description}
                </p>
            )}

            {/* Metadata */}
            <div className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)] pt-3 border-t border-[var(--color-border)]">
                <div className="flex items-center gap-1.5" title="Created date">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                {project.users && project.users.length > 0 && (
                    <div className="flex items-center gap-1.5" title="Team members">
                        <Users className="h-3.5 w-3.5" />
                        <span>{project.users.length} member{project.users.length !== 1 ? 's' : ''}</span>
                    </div>
                )}
                {project.admin && (
                    <div className="flex items-center gap-1.5 ml-auto" title="Project owner">
                        <UserIcon className="h-3.5 w-3.5" />
                        <span className="truncate max-w-[120px]">{project.admin.firstName} {project.admin.lastName}</span>
                    </div>
                )}
            </div>

            {/* Hover indicator */}
            {onClick && (
                <div className="absolute inset-0 rounded-xl border-2 border-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            )}
        </div>
    );
};
