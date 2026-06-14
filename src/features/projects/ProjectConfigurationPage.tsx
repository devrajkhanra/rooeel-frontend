import { useParams, useNavigate } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2, Save, Trash2 } from 'lucide-react';
import { createProjectClient } from '../../lib/graphql-client';
import {
  ACTIVE_PROJECT_QUERY,
  DELETE_PROJECT_CONFIGURATION_MUTATION,
  UPDATE_PROJECT_CONFIGURATION_MUTATION,
} from '../../lib/graphql/projects.operations';
import { TENDER_STAGES_QUERY } from '../../lib/graphql/tendering.operations';
import type { Project } from '../../types/project.types';
import type { TenderStage } from '../../types/tendering.types';

const configSchema = z.object({
  notes: z.string().optional(),
  metadata: z.string().optional(),
});

type ConfigFormValues = z.infer<typeof configSchema>;

function metadataToText(metadata: Record<string, unknown> | null | undefined) {
  return metadata ? JSON.stringify(metadata, null, 2) : '';
}

export function ProjectConfigurationPage() {
  const { projectId } = useParams({
    from: '/dashboard/projects/$projectId/configuration',
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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

  const { data: stages } = useQuery({
    queryKey: ['tenderStages', projectId],
    queryFn: async () => {
      const result = await client.request<{ tenderStages: TenderStage[] }>(
        TENDER_STAGES_QUERY,
      );
      return result.tenderStages;
    },
  });

  const loiAwarded =
    stages?.find((stage) => stage.stage === 'LOI_AWARDED')?.status ===
    'COMPLETED';

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ConfigFormValues>({
    resolver: zodResolver(configSchema),
    values: {
      notes: project?.configuration?.notes ?? '',
      metadata: metadataToText(project?.configuration?.metadata),
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: ConfigFormValues) => {
      let metadata: Record<string, unknown> | null;
      if (values.metadata?.trim()) {
        try {
          metadata = JSON.parse(values.metadata);
        } catch {
          throw new Error('Metadata must be valid JSON.');
        }
      } else {
        metadata = null;
      }

      await client.request(UPDATE_PROJECT_CONFIGURATION_MUTATION, {
        input: {
          notes: values.notes || undefined,
          metadata,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      queryClient.invalidateQueries({ queryKey: ['myProjects'] });
    },
    onError: (error: Error) => {
      setError('root', {
        message: error.message ?? 'Failed to update configuration.',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => client.request(DELETE_PROJECT_CONFIGURATION_MUTATION),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      queryClient.invalidateQueries({ queryKey: ['myProjects'] });
      reset({ notes: '', metadata: '' });
    },
    onError: (error: Error) => {
      setError('root', {
        message: error.message ?? 'Failed to delete configuration.',
      });
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
        <p className="text-body-sm text-error">
          Failed to load project configuration.
        </p>
        <button
          onClick={() =>
            navigate({ to: '/projects/$projectId', params: { projectId } })
          }
          className="flex items-center gap-1 text-body-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Project
        </button>
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <button
        onClick={() =>
          navigate({ to: '/projects/$projectId', params: { projectId } })
        }
        className="mb-4 flex items-center gap-1 text-body-sm text-outline transition-colors hover:text-on-surface"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Project
      </button>

      <div className="mb-6 rounded border border-outline-variant bg-surface-container-lowest p-4 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-1 text-label-md font-semibold uppercase tracking-widest text-primary">
              Project Configuration
            </p>
            <h1 className="text-headline-lg font-semibold text-on-surface">
              {project.name}
            </h1>
          </div>
          <span
            className={`inline-flex w-fit rounded-full px-2.5 py-0.5 text-label-md font-semibold ${
              loiAwarded
                ? 'bg-[#f0fdf4] text-[#16a34a]'
                : 'bg-[#f1f5f9] text-[#64748b]'
            }`}
          >
            {loiAwarded ? 'Unlocked' : 'Locked until LOI Award'}
          </span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit((values) => updateMutation.mutate(values))}
        className="rounded border border-outline-variant bg-surface-container-lowest"
      >
        <div className="border-b border-outline-variant px-4 py-3">
          <h2 className="text-body-md font-semibold text-on-surface">
            Configuration Details
          </h2>
        </div>

        <div className="space-y-4 p-4 sm:p-6">
          {!loiAwarded && (
            <p className="rounded border border-outline-variant bg-surface-container-low p-3 text-body-sm text-on-surface-variant">
              Configuration can be edited only after the LOI Award stage is
              completed.
            </p>
          )}

          {errors.root && (
            <p className="rounded border border-error/20 bg-error/10 p-2 text-body-sm text-error">
              {errors.root.message}
            </p>
          )}

          <div>
            <label className="mb-1 block text-body-sm font-semibold text-on-surface">
              Notes
            </label>
            <textarea
              {...register('notes')}
              rows={5}
              disabled={!loiAwarded || updateMutation.isPending}
              className="block w-full resize-none rounded border border-outline-variant p-2 text-body-sm text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary-container/40 disabled:bg-surface-container-low disabled:text-outline"
              placeholder="Configuration notes after LOI award..."
            />
          </div>

          <div>
            <label className="mb-1 block text-body-sm font-semibold text-on-surface">
              Metadata JSON
            </label>
            <textarea
              {...register('metadata')}
              rows={9}
              disabled={!loiAwarded || updateMutation.isPending}
              className="block w-full resize-none rounded border border-outline-variant p-2 font-mono text-label-md text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary-container/40 disabled:bg-surface-container-low disabled:text-outline"
              placeholder={'{\n  "awardValue": 12500000\n}'}
            />
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-outline-variant px-4 py-3 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Delete project configuration?')) {
                deleteMutation.mutate();
              }
            }}
            disabled={!loiAwarded || deleteMutation.isPending}
            className="flex h-8 items-center justify-center gap-1.5 rounded border border-outline-variant px-3 text-body-sm font-medium text-error transition-colors hover:bg-error/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleteMutation.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            Delete
          </button>
          <button
            type="submit"
            disabled={!loiAwarded || updateMutation.isPending}
            className="flex h-8 items-center justify-center gap-1.5 rounded bg-primary px-4 text-body-sm font-semibold text-on-primary transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-70"
          >
            {updateMutation.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
