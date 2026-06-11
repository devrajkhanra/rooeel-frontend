import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProjectClient } from '../../lib/graphql-client';
import { UPDATE_PROJECT_MUTATION } from '../../lib/graphql/projects.operations';
import type { Project } from '../../types/project.types';

const editSchema = z.object({
  title: z.string().min(3, { message: 'Project title must be at least 3 characters' }),
  description: z.string().optional(),
});

type EditFormValues = z.infer<typeof editSchema>;

interface Props {
  project: Project;
  onClose: () => void;
}

export function EditProjectModal({ project, onClose }: Props) {
  const queryClient = useQueryClient();
  const client = createProjectClient(project.id);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: project.name,
      description: project.description ?? '',
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: EditFormValues) => {
      await client.request(UPDATE_PROJECT_MUTATION, {
        input: {
          projectId: project.id,
          title: values.title,
          description: values.description,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProjects'] });
      queryClient.invalidateQueries({ queryKey: ['project', project.id] });
      onClose();
    },
    onError: (error: Error) => {
      setError('root', { message: error.message ?? 'Failed to update project.' });
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/20 backdrop-blur-sm">
      <div className="w-full max-w-[480px] rounded bg-surface-container-lowest shadow-popover">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant p-4">
          <h2 className="text-headline-md font-semibold text-on-surface">Edit Project</h2>
          <button
            onClick={onClose}
            disabled={updateMutation.isPending}
            className="rounded p-1 text-outline hover:bg-surface-container transition-colors disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit((v) => updateMutation.mutate(v))} className="p-4 space-y-4">
          {errors.root && (
            <p className="rounded bg-error/10 p-2 text-body-sm text-error border border-error/20">
              {errors.root.message}
            </p>
          )}

          <div>
            <label className="mb-1 block text-body-sm font-semibold text-on-surface">
              Project Title <span className="text-error">*</span>
            </label>
            <input
              type="text"
              {...register('title')}
              className="block w-full rounded border border-outline-variant p-2 text-body-sm text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary-container/40"
            />
            {errors.title && (
              <p className="mt-1 text-label-sm text-error">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-body-sm font-semibold text-on-surface">
              Description <span className="font-normal text-outline">(Optional)</span>
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="block w-full resize-none rounded border border-outline-variant p-2 text-body-sm text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary-container/40"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={updateMutation.isPending}
              className="h-8 px-3 text-body-sm font-medium text-on-surface-variant hover:bg-surface-container rounded transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex h-8 items-center gap-1.5 rounded bg-primary px-4 text-body-sm font-semibold text-on-primary transition-colors hover:bg-primary-container disabled:opacity-70"
            >
              {updateMutation.isPending && <Loader2 className="h-3 w-3 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
