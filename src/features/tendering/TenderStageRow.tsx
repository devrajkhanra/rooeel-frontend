import { useState } from 'react';
import { FileText, ChevronDown, ChevronUp, Loader2, RotateCw } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddDocumentModal } from './AddDocumentModal';
import {
  START_TENDER_STAGE_MUTATION,
  COMPLETE_TENDER_STAGE_MUTATION,
  SKIP_TENDER_STAGE_MUTATION,
} from '../../lib/graphql/tendering.operations';
import { STAGE_LABELS } from '../../types/tendering.types';
import type { TenderStage } from '../../types/tendering.types';
import type { GraphQLClient } from 'graphql-request';

const STATUS_STYLES: Record<string, { badge: string; label: string }> = {
  NOT_STARTED: { badge: 'text-[#64748b] bg-[#f1f5f9]', label: 'Not Started' },
  IN_PROGRESS: { badge: 'text-[#0066cc] bg-[#e8f0fe]', label: 'In Progress' },
  COMPLETED: { badge: 'text-[#16a34a] bg-[#f0fdf4]', label: 'Completed' },
  SKIPPED: { badge: 'text-[#92400e] bg-[#fef3c7]', label: 'Skipped' },
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

interface Props {
  stage: TenderStage;
  projectId: string;
  client: GraphQLClient;
  isFirst: boolean;
}

export function TenderStageRow({ stage, projectId, client, isFirst }: Props) {
  const [expanded, setExpanded] = useState(stage.status === 'IN_PROGRESS');
  const [addDocOpen, setAddDocOpen] = useState(false);
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['tenderStages', projectId] });

  const startMutation = useMutation({
    mutationFn: () =>
      client.request(START_TENDER_STAGE_MUTATION, { input: { stageId: stage.id } }),
    onSuccess: invalidate,
  });

  const completeMutation = useMutation({
    mutationFn: () =>
      client.request(COMPLETE_TENDER_STAGE_MUTATION, { input: { stageId: stage.id } }),
    onSuccess: invalidate,
  });

  const skipMutation = useMutation({
    mutationFn: () =>
      client.request(SKIP_TENDER_STAGE_MUTATION, { input: { stageId: stage.id } }),
    onSuccess: invalidate,
  });

  const isLocked = stage.status === 'NOT_STARTED' && !isFirst;
  const isPending = startMutation.isPending || completeMutation.isPending || skipMutation.isPending;
  const statusStyle = STATUS_STYLES[stage.status] ?? STATUS_STYLES.NOT_STARTED;

  return (
    <div
      className={`rounded border transition-all ${
        stage.status === 'IN_PROGRESS'
          ? 'border-primary/30 bg-[#f8fbff]'
          : stage.status === 'LOCKED' || isLocked
          ? 'border-outline-variant bg-surface-container-lowest opacity-60'
          : 'border-outline-variant bg-surface-container-lowest'
      }`}
    >
      {addDocOpen && (
        <AddDocumentModal
          stageId={stage.id}
          projectId={projectId}
          client={client}
          onClose={() => setAddDocOpen(false)}
        />
      )}

      {/* Stage Header Row */}
      <div className="flex items-center gap-3 p-4">
        {/* Spinner / Status icon */}
        <div className="flex-shrink-0">
          {stage.status === 'IN_PROGRESS' ? (
            <RotateCw className="h-4 w-4 text-primary animate-spin" style={{ animationDuration: '3s' }} />
          ) : (
            <FileText className={`h-4 w-4 ${isLocked ? 'text-outline' : 'text-on-surface-variant'}`} />
          )}
        </div>

        {/* Stage Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`font-semibold text-body-md ${isLocked ? 'text-outline' : 'text-on-surface'}`}
            >
              {STAGE_LABELS[stage.stage]}
            </span>
            <span className={`rounded px-2 py-0.5 text-label-sm font-medium ${statusStyle.badge}`}>
              {statusStyle.label}
            </span>
          </div>
          {stage.startedAt && (
            <p className="text-label-md text-outline mt-0.5">
              Start Date: {formatDate(stage.startedAt)}
            </p>
          )}
          {isLocked && (
            <p className="text-label-md text-outline mt-0.5">
              Locked until earlier stages are handled
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {stage.status === 'IN_PROGRESS' && (
            <>
              <button
                id={`add-doc-${stage.id}`}
                onClick={() => setAddDocOpen(true)}
                disabled={isPending}
                className="flex h-7 items-center gap-1 rounded border border-outline-variant px-2.5 text-label-md font-medium text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-50"
              >
                + Add Doc
              </button>
              <button
                id={`complete-stage-${stage.id}`}
                onClick={() => completeMutation.mutate()}
                disabled={isPending}
                className="flex h-7 items-center gap-1.5 rounded bg-primary px-3 text-label-md font-semibold text-on-primary hover:bg-primary-container transition-colors disabled:opacity-70"
              >
                {completeMutation.isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  '✓ Complete'
                )}
              </button>
            </>
          )}

          {stage.status === 'NOT_STARTED' && (
            <>
              <button
                id={`skip-stage-${stage.id}`}
                onClick={() => skipMutation.mutate()}
                disabled={isPending || isLocked}
                className="flex h-7 items-center rounded border border-outline-variant px-2.5 text-label-md font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50"
              >
                {skipMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Skip'}
              </button>
              <button
                id={`start-stage-${stage.id}`}
                onClick={() => startMutation.mutate()}
                disabled={isPending || isLocked}
                className="flex h-7 items-center gap-1.5 rounded border border-primary px-3 text-label-md font-semibold text-primary hover:bg-surface-container-low transition-colors disabled:opacity-50"
              >
                {startMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : '▶ Start'}
              </button>
            </>
          )}

          {/* Expand toggle (if has docs or events) */}
          {(stage.documents.length > 0 || stage.events.length > 0) && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="ml-1 p-1 rounded text-outline hover:bg-surface-container-low transition-colors"
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Documents List */}
      {expanded && stage.documents.length > 0 && (
        <div className="border-t border-outline-variant px-4 pb-3 pt-2 space-y-2">
          {stage.documents.map((doc) => (
            <div key={doc.id} className="space-y-1">
              {doc.attachments.length > 0 ? (
                doc.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center gap-2 rounded bg-surface-container-low px-3 py-2 text-body-sm"
                  >
                    <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="font-medium text-on-surface">{att.fileName}</span>
                    {att.sizeBytes && (
                      <span className="ml-auto text-outline">
                        {formatBytes(att.sizeBytes)}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-2 rounded bg-surface-container-low px-3 py-2 text-body-sm">
                  <FileText className="h-4 w-4 text-outline flex-shrink-0" />
                  <span className="text-on-surface-variant">{doc.title}</span>
                  <span className="ml-auto text-label-sm text-outline italic">No attachment</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
