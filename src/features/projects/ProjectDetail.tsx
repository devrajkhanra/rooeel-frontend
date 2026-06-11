import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Edit, Plus, ArrowLeft, FileText, Users, FileCheck, BarChart2, ChevronRight, Lock } from 'lucide-react';
import { createProjectClient } from '../../lib/graphql-client';
import { ACTIVE_PROJECT_QUERY } from '../../lib/graphql/projects.operations';
import { EditProjectModal } from './EditProjectModal';
import type { Project } from '../../types/project.types';

type ModuleStatus = 'In Progress' | 'Pending Setup' | 'Locked' | 'Active';

interface ProjectModule {
  id: string;
  title: string;
  description: string;
  status: ModuleStatus;
  icon: React.ReactNode;
  detail: string;
  detailIcon?: React.ReactNode;
  locked: boolean;
  route?: string;
}

const STATUS_COLORS: Record<ModuleStatus, string> = {
  'In Progress': 'text-[#0066cc] bg-[#e8f0fe]',
  'Pending Setup': 'text-[#7b5ea7] bg-[#f0ebfa]',
  'Locked': 'text-[#64748b] bg-[#f1f5f9]',
  'Active': 'text-[#16a34a] bg-[#f0fdf4]',
};

export function ProjectDetail() {
  const { projectId } = useParams({ from: '/dashboard/projects/$projectId' });
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const client = createProjectClient(projectId);

  const { data: project, isLoading, isError } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const result = await client.request<{ activeProject: Project }>(ACTIVE_PROJECT_QUERY);
      return result.activeProject;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3">
        <p className="text-body-sm text-error">Failed to load project.</p>
        <button
          onClick={() => navigate({ to: '/projects' })}
          className="flex items-center gap-1 text-body-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Projects
        </button>
      </div>
    );
  }

  const modules: ProjectModule[] = [
    {
      id: 'tendering',
      title: 'Tendering',
      description: 'Manage RFPs, vendor bids, and technical evaluations.',
      status: 'In Progress',
      icon: <FileText className="h-5 w-5 text-[#0066cc]" />,
      detail: `${project.tenderStageCount} Stages`,
      locked: false,
      route: `/projects/${projectId}/tendering`,
    },
    {
      id: 'vendors',
      title: 'Vendors',
      description: 'Onboard suppliers and manage vendor compliances.',
      status: 'Pending Setup',
      icon: <Users className="h-5 w-5 text-[#7b5ea7]" />,
      detail: '0 Assigned',
      locked: false,
    },
    {
      id: 'contracts',
      title: 'Contracts',
      description: 'Legal agreements, terms, and milestone definitions.',
      status: 'Locked',
      icon: <FileCheck className="h-5 w-5 text-[#64748b]" />,
      detail: 'Requires Tendering',
      locked: true,
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Project timeline tracking and financial burn rate.',
      status: 'Active',
      icon: <BarChart2 className="h-5 w-5 text-[#16a34a]" />,
      detail: 'On Track',
      locked: false,
    },
  ];

  return (
    <div>
      {isEditOpen && (
        <EditProjectModal project={project} onClose={() => setIsEditOpen(false)} />
      )}

      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-body-sm text-outline">
        <button
          onClick={() => navigate({ to: '/projects' })}
          className="hover:text-on-surface transition-colors"
        >
          Projects
        </button>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-on-surface">{project.name}</span>
      </div>

      {/* Project Header Card */}
      <div className="mb-6 rounded border border-outline-variant bg-surface-container-lowest p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <h1 className="text-headline-lg font-semibold text-on-surface">{project.name}</h1>
            <span className="inline-flex items-center rounded-full bg-[#e8f0fe] px-2.5 py-0.5 text-label-md font-semibold text-[#0066cc] uppercase tracking-wide">
              {project.status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="edit-project-detail"
              onClick={() => setIsEditOpen(true)}
              className="flex h-8 items-center gap-1.5 rounded border border-outline-variant bg-surface-container-lowest px-3 text-body-sm font-medium text-on-surface transition-colors hover:bg-surface-container-low"
            >
              <Edit className="h-3.5 w-3.5" />
              Edit Details
            </button>
            <button
              disabled
              className="flex h-8 items-center gap-1.5 rounded bg-primary px-3 text-body-sm font-semibold text-on-primary opacity-50 cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
              New Module
            </button>
          </div>
        </div>
        <p className="text-body-sm text-on-surface-variant max-w-2xl">
          {project.description ?? (
            <span className="italic text-outline">No description provided.</span>
          )}
        </p>
      </div>

      {/* Project Modules */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-headline-md font-semibold text-on-surface">Project Modules</h2>
        <div className="flex items-center gap-2 text-body-sm text-outline">
          <span>FILTER BY:</span>
          <button className="flex items-center gap-1 rounded border border-outline-variant px-2 py-1 text-on-surface hover:bg-surface-container-low transition-colors">
            All Modules
            <ChevronRight className="h-3.5 w-3.5 rotate-90" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {modules.map((mod) => (
          <div
            key={mod.id}
            onClick={() => {
              if (!mod.locked && mod.route) {
                navigate({ to: mod.route as any });
              }
            }}
            className={`relative flex flex-col rounded border border-outline-variant bg-surface-container-lowest p-4 transition-all
              ${!mod.locked && mod.route ? 'cursor-pointer hover:shadow-md hover:border-primary/30' : ''}
              ${mod.locked ? 'opacity-70' : ''}`}
          >
            {/* Lock overlay */}
            {mod.locked && (
              <div className="absolute inset-0 flex items-start justify-end rounded p-2">
                <Lock className="h-4 w-4 text-outline" />
              </div>
            )}

            {/* Status badge */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded bg-surface-container-low">
                {mod.icon}
              </div>
              <span className={`rounded px-2 py-0.5 text-label-sm font-medium ${STATUS_COLORS[mod.status]}`}>
                {mod.status}
              </span>
            </div>

            <h3 className="mb-1 text-body-lg font-semibold text-on-surface">{mod.title}</h3>
            <p className="mb-4 flex-1 text-body-sm text-on-surface-variant">{mod.description}</p>

            <div className="flex items-center justify-between border-t border-outline-variant pt-3">
              <span className="text-body-sm text-outline flex items-center gap-1">
                {mod.locked && <Lock className="h-3 w-3" />}
                {mod.detail}
              </span>
              {!mod.locked && (
                <ChevronRight className="h-4 w-4 text-outline" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
