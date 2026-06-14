import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CREATE_TENDER_STAGE_DOCUMENT_MUTATION,
  CREATE_TENDER_STAGE_EVENT_DOCUMENT_MUTATION,
} from '../../lib/graphql/tendering.operations';
import { dateInputToIso } from './dateInput';
import { uploadDocumentAttachments } from './documentUpload';
import type { DocumentRecord } from '../../types/document.types';
import type { GraphQLClient } from 'graphql-request';

const schema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  documentDate: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  stageId?: string;
  eventId?: string;
  projectId: string;
  client: GraphQLClient;
  onClose: () => void;
}

export function AddDocumentModal({
  stageId,
  eventId,
  projectId,
  client,
  onClose,
}: Props) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const document = await createDocumentRecord(values);
      await uploadDocumentAttachments(client, document.id, selectedFiles);

      return document;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenderStages', projectId] });
      onClose();
    },
    onError: (err: Error) => {
      setError(err.message ?? 'Failed to add document.');
    },
  });

  async function createDocumentRecord(values: FormValues) {
    const input = {
      title: values.title,
      description: values.description || undefined,
      documentDate: dateInputToIso(values.documentDate),
    };

    if (eventId) {
      const result = await client.request<{
        createTenderStageEventDocument: DocumentRecord;
      }>(CREATE_TENDER_STAGE_EVENT_DOCUMENT_MUTATION, {
        input: {
          eventId,
          ...input,
        },
      });
      return result.createTenderStageEventDocument;
    }

    if (!stageId) {
      throw new Error('A stage or communication is required.');
    }

    const result = await client.request<{ createTenderStageDocument: DocumentRecord }>(
      CREATE_TENDER_STAGE_DOCUMENT_MUTATION,
      {
        input: {
          stageId,
          ...input,
        },
      },
    );
    return result.createTenderStageDocument;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/20 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[440px] rounded bg-surface-container-lowest shadow-popover">
        <div className="flex items-center justify-between border-b border-outline-variant p-4">
          <h2 className="text-headline-md font-semibold text-on-surface">
            Add Document
          </h2>
          <button
            onClick={onClose}
            disabled={mutation.isPending}
            className="rounded p-1 text-outline transition-colors hover:bg-surface-container disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit((v) => mutation.mutate(v))}
          className="space-y-4 p-4"
        >
          {error && (
            <p className="rounded border border-error/20 bg-error/10 p-2 text-body-sm text-error">
              {error}
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
              placeholder="e.g., Signed site visit report"
            />
            {errors.title && (
              <p className="mt-1 text-label-sm text-error">
                {errors.title.message}
              </p>
            )}
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
              placeholder="Brief description of the document..."
            />
          </div>

          <div>
            <label className="mb-1 block text-body-sm font-semibold text-on-surface">
              Document Date{' '}
              <span className="font-normal text-outline">(Optional)</span>
            </label>
            <input
              type="date"
              {...register('documentDate')}
              className="block w-full rounded border border-outline-variant p-2 text-body-sm text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary-container/40"
            />
          </div>

          <div>
            <label className="mb-1 block text-body-sm font-semibold text-on-surface">
              Attachments{' '}
              <span className="font-normal text-outline">(Optional)</span>
            </label>
            <input
              type="file"
              multiple
              onChange={(event) =>
                setSelectedFiles(Array.from(event.target.files ?? []))
              }
              className="block w-full rounded border border-outline-variant p-2 text-body-sm text-on-surface file:mr-3 file:rounded file:border-0 file:bg-surface-container-low file:px-3 file:py-1.5 file:text-body-sm file:font-medium file:text-on-surface hover:file:bg-surface-container"
            />
            {selectedFiles.length > 0 && (
              <p className="mt-1 text-label-sm text-outline">
                {selectedFiles.length} file
                {selectedFiles.length === 1 ? '' : 's'} selected
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
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
                <Loader2 className="h-3 w-3 animate-spin" />
              )}
              {mutation.isPending ? 'Saving...' : 'Add Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
