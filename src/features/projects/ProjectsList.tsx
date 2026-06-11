import { useState } from 'react';
import { Plus, FolderOpen, Edit, Trash2, ChevronRight, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { CreateProjectModal, type ProjectFormValues } from './CreateProjectModal';
import { EditProjectModal } from './EditProjectModal';
import { graphQLClient } from '../../lib/graphql-client';
import {
  MY_PROJECTS_QUERY,
  CREATE_PROJECT_MUTATION,
  DELETE_PROJECT_MUTATION,
} from '../../lib/graphql/projects.operations';
import type { Project } from '../../types/project.types';

const STATUS_LABELS: Record<string, string> = {
  TENDERING: 'Tendering',
};

export function ProjectsList() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['myProjects'],
    queryFn: async () => {
      const result = await graphQLClient.request<{ myProjects: Project[] }>(MY_PROJECTS_QUERY);
      return result.myProjects;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (input: ProjectFormValues) => {
      const result = await graphQLClient.request<{ createProject: Project }>(
        CREATE_PROJECT_MUTATION,
        { input },
      );
      return result.createProject;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProjects'] });
      setIsCreateModalOpen(false);
      setCreateError(null);
    },
    onError: (error: Error) => {
      setCreateError(error.message ?? 'Failed to create project.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (projectId: string) => {
      await graphQLClient.request(DELETE_PROJECT_MUTATION, undefined, {
        'x-project-id': projectId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProjects'] });
      setDeletingId(null);
    },
  });

  const projects = data ?? [];

  return (
    <div className="h-full">
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => { setIsCreateModalOpen(false); setCreateError(null); }}
        onCreate={(data) => createMutation.mutateAsync(data)}
        isLoading={createMutation.isPending}
        error={createError}
      />

      {editingProject && (
        <EditProjectModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
        />
      )}

      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="mb-1 text-headline-lg font-semibold text-on-surface">Projects</h1>
          <p className="text-body-sm text-on-surface-variant">
            Create a project and manage its tendering phase from one controlled workspace.
          </p>
        </div>
        <button
          id="create-project-open"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex h-8 items-center gap-1.5 rounded bg-primary px-3 text-body-sm font-semibold text-on-primary transition-colors hover:bg-primary-container"
        >
          <Plus className="h-4 w-4" />
          Create project
        </button>
      </div>

      {/* Main Area */}
      <div className="rounded border border-outline-variant bg-surface-container-lowest min-h-[400px]">
        {isLoading ? (
          <div className="flex h-[400px] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="flex h-[400px] flex-col items-center justify-center gap-2 text-center p-8">
            <p className="text-body-sm text-error">Failed to load projects. Please refresh.</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex h-[400px] flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded bg-surface-container-low">
              <FolderOpen className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-label-md font-medium uppercase text-on-surface">No Projects Yet</h3>
            <p className="mb-4 max-w-sm text-body-sm text-outline">
              Start with a project title. The system will create the tendering workflow automatically.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex h-8 items-center rounded border border-outline-variant bg-surface-container-lowest px-4 text-body-sm font-medium text-on-surface transition-colors hover:bg-surface-container-low"
            >
              Create project
            </button>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-body-sm tabular-nums">
              <thead className="border-b border-outline-variant bg-[#F1F5F9] text-label-md font-medium uppercase text-outline">
                <tr>
                  <th className="px-3 py-2">Project</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Tender Stages</th>
                  <th className="px-3 py-2">Description</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant text-on-surface-variant">
                {projects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-surface transition-colors cursor-pointer"
                    onClick={() => navigate({ to: '/projects/$projectId', params: { projectId: project.id } })}
                  >
                    <td className="px-3 py-2 font-medium text-on-surface max-w-[280px]">
                      <span className="flex items-center gap-1">
                        {project.name}
                        <ChevronRight className="h-3 w-3 text-outline flex-shrink-0" />
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="inline-flex rounded-full bg-surface-container px-2 py-0.5 text-label-sm font-semibold text-primary">
                        {STATUS_LABELS[project.status] ?? project.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      {project.tenderStageCount} stages
                    </td>
                    <td className="px-3 py-2 max-w-[280px] truncate">
                      {project.description ?? <span className="text-outline italic">No description</span>}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div
                        className="flex items-center justify-end gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          id={`edit-project-${project.id}`}
                          onClick={() => setEditingProject(project)}
                          className="flex h-6 items-center gap-1 rounded px-2 text-label-md text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </button>
                        <button
                          id={`delete-project-${project.id}`}
                          onClick={() => {
                            if (confirm(`Delete "${project.name}"? This cannot be undone.`)) {
                              setDeletingId(project.id);
                              deleteMutation.mutate(project.id);
                            }
                          }}
                          disabled={deletingId === project.id}
                          className="flex h-6 items-center gap-1 rounded px-2 text-label-md text-error hover:bg-error-container hover:text-on-error-container transition-colors disabled:opacity-50"
                        >
                          {deletingId === project.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}