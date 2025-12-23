import React from 'react';
import { ProjectCard } from './ProjectCard';
import type { Project } from '@/types/api.types';

interface ProjectListProps {
    projects: Project[];
    onProjectClick?: (project: Project) => void;
    emptyMessage?: string;
}

export const ProjectList: React.FC<ProjectListProps> = ({
    projects,
    onProjectClick,
    emptyMessage = 'No projects found',
}) => {
    if (projects.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-[var(--color-text-secondary)]">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
                <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={onProjectClick ? () => onProjectClick(project) : undefined}
                />
            ))}
        </div>
    );
};
