import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CREATE_TENDER_STAGE_DOCUMENT_MUTATION } from '../../lib/graphql/tendering.operations';
import type { DocumentRecord } from '../../types/document.types';

const schema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  documentDate: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  stageId: string;
  projectId: string;
  client: import('graphql-request').GraphQLClient;
  onClose: () => void;
}

export function AddDocumentModal({ stageId, projectId, client, onClose }: Props) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const result = await client.request<{ createTenderStageDocument: DocumentRecord }>(
        CREATE_TENDER_STAGE_DOCUMENT_MUTATION,
        {
          input: {
            stageId,
            title: values.title,
            description: values.description || undefined,
            documentDate: values.documentDate || undefined,
          },
        },
      );
      return result.createTenderStageDocument;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenderStages', projectId] });
      onClose();
    },
    onError: (err: Error) => {
      setError(err.message ?? 'Failed to add document.');
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/20 backdrop-blur-sm">
      <div className="w-full max-w-[440px] rounded bg-surface-container-lowest shadow-popover">

        <div className="flex items-center justify-between border-b border-outline-variant p-4">
          <h2 className="text-headline-md font-semibold text-on-surface">Add Document</h2>
          <button
            onClick={onClose}
            disabled={mutation.isPending}
            className="rounded p-1 text-outline hover:bg-surface-container transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="p-4 space-y-4">
          {error && (
            <p className="rounded bg-error/10 p-2 text-body-sm text-error border border-error/20">
              {error}
            </p>
          )}

          <div>
            <label className="mb-1 block text-body-sm font-semibold text-on-surface">
              Title <span className="text-error">*</span>
            </label>
            <input
              type="text"
              {...register('title')}
              className="block w-full rounded border border-outline-variant p-2 text-body-sm text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary-container/40"
              placeholder="e.g., Draft RFP Q1"
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
              rows={3}
              className="block w-full resize-none rounded border border-outline-variant p-2 text-body-sm text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary-container/40"
              placeholder="Brief description of the document..."
            />
          </div>

          <div>
            <label className="mb-1 block text-body-sm font-semibold text-on-surface">
              Document Date <span className="font-normal text-outline">(Optional)</span>
            </label>
            <input
              type="date"
              {...register('documentDate')}
              className="block w-full rounded border border-outline-variant p-2 text-body-sm text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary-container/40"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={mutation.isPending}
              className="h-8 px-3 text-body-sm font-medium text-on-surface-variant hover:bg-surface-container rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex h-8 items-center gap-1.5 rounded bg-primary px-4 text-body-sm font-semibold text-on-primary transition-colors hover:bg-primary-container disabled:opacity-70"
            >
              {mutation.isPending && <Loader2 className="h-3 w-3 animate-spin" />}
              Add Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
