import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Loader2,
  Edit,
  Plus,
  ArrowLeft,
  FileText,
  ChevronRight,
  Lock,
  Trash2,
  Settings,
  RotateCcw,
  MoreVertical,
} from 'lucide-react';
import { createProjectClient } from '../../lib/graphql-client';
import {
  ACTIVE_PROJECT_QUERY,
  CREATE_PROJECT_MODULE_MUTATION,
  DELETE_PROJECT_MODULE_MUTATION,
  UPDATE_PROJECT_MODULE_MUTATION,
} from '../../lib/graphql/projects.operations';
import { EditProjectModal } from './EditProjectModal';
import type { Project, ProjectModule } from '../../types/project.types';

type ModuleStatus = 'In Progress' | 'Archived' | 'Locked' | 'Active';

const STATUS_COLORS: Record<ModuleStatus, string> = {
  'In Progress': 'text-[#0066cc] bg-[#e8f0fe]',
  Archived: 'text-[#92400e] bg-[#fef3c7]',
  Locked: 'text-[#64748b] bg-[#f1f5f9]',
  Active: 'text-[#16a34a] bg-[#f0fdf4]',
};

export function ProjectDetail() {
  const { projectId } = useParams({ from: '/dashboard/projects/$projectId' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const client = createProjectClient(projectId);

  const { data: project, isLoading, isError } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const result = await client.request<{ activeProject: Project }>(
        ACTIVE_PROJECT_QUERY,
      );
      return result.activeProject;
    },
  });

  const invalidateProject = () => {
    queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    queryClient.invalidateQueries({ queryKey: ['myProjects'] });
  };

  const createModuleMutation = useMutation({
    mutationFn: () =>
      client.request(CREATE_PROJECT_MODULE_MUTATION, {
        input: { type: 'TENDERING' },
      }),
    onSuccess: () => {
      setActionError(null);
      invalidateProject();
    },
    onError: (error: Error) => setActionError(error.message),
  });

  const updateModuleMutation = useMutation({
    mutationFn: (input: { moduleId: string; name?: string; description?: string }) =>
      client.request(UPDATE_PROJECT_MODULE_MUTATION, { input }),
    onSuccess: () => {
      setActionError(null);
      invalidateProject();
    },
    onError: (error: Error) => setActionError(error.message),
  });

  const deleteModuleMutation = useMutation({
    mutationFn: (moduleId: string) =>
      client.request(DELETE_PROJECT_MODULE_MUTATION, { moduleId }),
    onSuccess: () => {
      setActionError(null);
      invalidateProject();
    },
    onError: (error: Error) => setActionError(error.message),
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

  const modules = project.modules ?? [];
  const tenderingModule = modules.find(
    (module) => module.type === 'TENDERING' && module.status === 'ACTIVE',
  );
  const archivedTenderingModule = modules.find(
    (module) => module.type === 'TENDERING' && module.status === 'ARCHIVED',
  );
  const moduleCards = tenderingModule ? [tenderingModule] : [];

  function renameModule(module: ProjectModule) {
    const name = window.prompt('Module name', module.name);
    if (!name || name.trim() === module.name) return;

    updateModuleMutation.mutate({
      moduleId: module.id,
      name: name.trim(),
      description: module.description,
    });
  }

  return (
    <div>
      {isEditOpen && (
        <EditProjectModal project={project} onClose={() => setIsEditOpen(false)} />
      )}

      <div className="mb-4 flex flex-wrap items-center gap-2 text-body-sm text-outline">
        <button
          onClick={() => navigate({ to: '/projects' })}
          className="transition-colors hover:text-on-surface"
        >
          Projects
        </button>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-on-surface">{project.name}</span>
      </div>

      <div className="mb-6 rounded border border-outline-variant bg-surface-container-lowest p-4 sm:p-6">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <h1 className="text-headline-lg font-semibold text-on-surface">
              {project.name}
            </h1>
            <span className="inline-flex items-center rounded-full bg-[#e8f0fe] px-2.5 py-0.5 text-label-md font-semibold uppercase tracking-wide text-[#0066cc]">
              {project.status}
            </span>
          </div>
          <div className="relative self-start">
            <button
              type="button"
              onClick={() => setActionMenuOpen((open) => !open)}
              className="flex h-8 w-8 items-center justify-center rounded border border-outline-variant bg-surface-container-lowest text-on-surface transition-colors hover:bg-surface-container-low"
              title="Project actions"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {actionMenuOpen && (
              <div className="absolute right-0 top-9 z-20 w-52 rounded border border-outline-variant bg-surface-container-lowest py-1 shadow-popover">
                <button
                  type="button"
                  onClick={() => {
                    setActionMenuOpen(false);
                    setIsEditOpen(true);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-body-sm text-on-surface transition-colors hover:bg-surface-container-low"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit Details
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActionMenuOpen(false);
                    createModuleMutation.mutate();
                  }}
                  disabled={Boolean(tenderingModule) || createModuleMutation.isPending}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-body-sm text-on-surface transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {createModuleMutation.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : archivedTenderingModule ? (
                    <RotateCcw className="h-3.5 w-3.5" />
                  ) : (
                    <Plus className="h-3.5 w-3.5" />
                  )}
                  {archivedTenderingModule ? 'Reactivate Tendering' : 'New Module'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActionMenuOpen(false);
                    navigate({
                      to: '/projects/$projectId/configuration',
                      params: { projectId },
                    });
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-body-sm text-on-surface transition-colors hover:bg-surface-container-low"
                >
                  <Settings className="h-3.5 w-3.5" />
                  Settings
                </button>
              </div>
            )}
          </div>
        </div>
        <p className="max-w-2xl text-body-sm text-on-surface-variant">
          {project.description ?? (
            <span className="italic text-outline">No description provided.</span>
          )}
        </p>
      </div>

      {actionError && (
        <p className="mb-4 rounded border border-error/20 bg-error/10 p-2 text-body-sm text-error">
          {actionError}
        </p>
      )}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-headline-md font-semibold text-on-surface">
          Project Modules
        </h2>
        <div className="flex flex-wrap items-center gap-2 text-body-sm text-outline">
          <span>FILTER BY:</span>
          <button className="flex items-center gap-1 rounded border border-outline-variant px-2 py-1 text-on-surface transition-colors hover:bg-surface-container-low">
            Active Modules
            <ChevronRight className="h-3.5 w-3.5 rotate-90" />
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {moduleCards.map((module) => (
          <div
            key={module.id}
            onClick={() =>
              navigate({
                to: '/projects/$projectId/tendering',
                params: { projectId },
              })
            }
            className="relative flex cursor-pointer flex-col rounded border border-outline-variant bg-surface-container-lowest p-4 transition-all hover:border-primary/30 hover:shadow-md"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded bg-surface-container-low">
                <FileText className="h-5 w-5 text-[#0066cc]" />
              </div>
              <span
                className={`rounded px-2 py-0.5 text-label-sm font-medium ${STATUS_COLORS['In Progress']}`}
              >
                In Progress
              </span>
            </div>

            <h3 className="mb-1 text-body-lg font-semibold text-on-surface">
              {module.name}
            </h3>
            <p className="mb-4 flex-1 text-body-sm text-on-surface-variant">
              {module.description ??
                'Tendering workflow from tender receipt through LOI award.'}
            </p>

            <div
              className="flex items-center justify-between border-t border-outline-variant pt-3"
              onClick={(event) => event.stopPropagation()}
            >
              <span className="text-body-sm text-outline">
                {project.tenderStageCount} Stages
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => renameModule(module)}
                  className="rounded p-1 text-outline transition-colors hover:bg-surface-container hover:text-on-surface"
                  title="Rename module"
                >
                  <Edit className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Archive "${module.name}"?`)) {
                      deleteModuleMutation.mutate(module.id);
                    }
                  }}
                  className="rounded p-1 text-error transition-colors hover:bg-error/10"
                  title="Archive module"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <ChevronRight className="h-4 w-4 text-outline" />
              </div>
            </div>
          </div>
        ))}

        {!tenderingModule && (
          <div className="relative flex flex-col rounded border border-outline-variant bg-surface-container-lowest p-4 opacity-80">
            <div className="absolute inset-0 flex items-start justify-end rounded p-2">
              <Lock className="h-4 w-4 text-outline" />
            </div>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded bg-surface-container-low">
                <FileText className="h-5 w-5 text-[#64748b]" />
              </div>
              <span
                className={`rounded px-2 py-0.5 text-label-sm font-medium ${STATUS_COLORS.Archived}`}
              >
                Archived
              </span>
            </div>
            <h3 className="mb-1 text-body-lg font-semibold text-on-surface">
              Tendering
            </h3>
            <p className="mb-4 flex-1 text-body-sm text-on-surface-variant">
              Reactivate the Tendering module to manage stages and documents.
            </p>
            <button
              onClick={() => createModuleMutation.mutate()}
              disabled={createModuleMutation.isPending}
              className="h-8 rounded border border-primary px-3 text-body-sm font-semibold text-primary transition-colors hover:bg-surface-container-low disabled:opacity-50"
            >
              Reactivate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
