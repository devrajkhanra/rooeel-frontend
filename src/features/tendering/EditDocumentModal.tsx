import { X, Loader2, CalendarDays, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { GraphQLClient } from 'graphql-request';
import { UPDATE_DOCUMENT_MUTATION } from '../../lib/graphql/documents.operations';
import type { DocumentRecord } from '../../types/document.types';
import { dateInputToIso } from './dateInput';

const schema = z.object({
  title: z.string().trim().min(2, 'Document title is required'),
  documentDate: z.string().optional(),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  document: DocumentRecord;
  projectId: string;
  client: GraphQLClient;
  onClose: () => void;
}

function toDateInputValue(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

export function EditDocumentModal({
  document,
  projectId,
  client,
  onClose,
}: Props) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: document.title,
      documentDate: toDateInputValue(document.documentDate),
      description: document.description ?? '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      await client.request(UPDATE_DOCUMENT_MUTATION, {
        input: {
          documentId: document.id,
          title: values.title,
          documentDate: dateInputToIso(values.documentDate),
          description: values.description || undefined,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenderStages', projectId] });
      onClose();
    },
    onError: (error: Error) => {
      setError('root', {
        message: error.message ?? 'Failed to update document.',
      });
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/20 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[520px] rounded bg-surface-container-lowest shadow-popover">
        <div className="flex items-center justify-between border-b border-outline-variant p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded bg-surface-container-low">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <h2 className="text-headline-md font-semibold text-on-surface">
                Edit Document
              </h2>
              <p className="truncate text-label-md text-outline">
                {document.attachments.length} attachment
                {document.attachments.length === 1 ? '' : 's'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={mutation.isPending}
            className="rounded p-1 text-outline transition-colors hover:bg-surface-container disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit((values) => mutation.mutate(values))}
          className="space-y-4 p-4"
        >
          {errors.root && (
            <p className="rounded border border-error/20 bg-error/10 p-2 text-body-sm text-error">
              {errors.root.message}
            </p>
          )}

          <div>
            <label className="mb-1 block text-body-sm font-semibold text-on-surface">
              Document Title <span className="text-error">*</span>
            </label>
            <input
              type="text"
              {...register('title')}
              className="block w-full rounded border border-outline-variant p-2 text-body-sm text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary-container/40"
            />
            {errors.title && (
              <p className="mt-1 text-label-sm text-error">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-body-sm font-semibold text-on-surface">
              Document Date{' '}
              <span className="font-normal text-outline">(Optional)</span>
            </label>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
              <input
                type="date"
                {...register('documentDate')}
                className="block h-9 w-full rounded border border-outline-variant bg-surface-container-lowest py-2 pl-9 pr-3 text-body-sm text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary-container/40"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-body-sm font-semibold text-on-surface">
              Description{' '}
              <span className="font-normal text-outline">(Optional)</span>
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="block w-full resize-none rounded border border-outline-variant p-2 text-body-sm text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary-container/40"
              placeholder="Briefly describe the document..."
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-outline-variant pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={mutation.isPending}
              className="h-8 rounded px-3 text-body-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex h-8 items-center gap-1.5 rounded bg-primary px-4 text-body-sm font-semibold text-on-primary transition-colors hover:bg-primary-container disabled:opacity-70"
            >
              {mutation.isPending && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
