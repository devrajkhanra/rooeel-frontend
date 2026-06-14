import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle2,
  Edit,
  Trash2,
  Download,
  Plus,
  Inbox,
  MapPin,
  MessageSquareText,
  Send,
  MessagesSquare,
  Gavel,
  Handshake,
  Award,
  CalendarDays,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddDocumentModal } from './AddDocumentModal';
import { EditDocumentModal } from './EditDocumentModal';
import {
  START_TENDER_STAGE_MUTATION,
  UPDATE_TENDER_STAGE_MUTATION,
  COMPLETE_TENDER_STAGE_MUTATION,
  SKIP_TENDER_STAGE_MUTATION,
} from '../../lib/graphql/tendering.operations';
import {
  ATTACHMENT_DOWNLOAD_URL_QUERY,
  DELETE_ATTACHMENT_MUTATION,
  DELETE_DOCUMENT_MUTATION,
  RENAME_ATTACHMENT_MUTATION,
} from '../../lib/graphql/documents.operations';
import {
  STAGE_LABELS,
  type TenderStage,
} from '../../types/tendering.types';
import type { DocumentAttachment, DocumentRecord } from '../../types/document.types';
import {
  formatBytes,
  formatDate,
  getAttachmentIcon,
  getDocumentIcon,
} from './documentDisplay';
import type { GraphQLClient } from 'graphql-request';

const STATUS_STYLES: Record<string, { badge: string; label: string }> = {
  NOT_STARTED: { badge: 'text-[#64748b] bg-[#f1f5f9]', label: 'Not Started' },
  IN_PROGRESS: {
    badge: 'text-primary bg-surface-container-low',
    label: 'In Progress',
  },
  COMPLETED: { badge: 'text-[#16a34a] bg-[#f0fdf4]', label: 'Completed' },
  SKIPPED: { badge: 'text-[#92400e] bg-[#fef3c7]', label: 'Skipped' },
};

const STAGE_ICONS: Record<TenderStage['stage'], LucideIcon> = {
  TENDER_RECEIVED: Inbox,
  SITE_VISIT: MapPin,
  PREBID_QUERY: MessageSquareText,
  TENDER_SUBMISSION: Send,
  CLARIFICATION: MessagesSquare,
  AUCTION: Gavel,
  NEGOTIATION: Handshake,
  LOI_AWARDED: Award,
};

function formatDateInput(dateStr?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';
  return toDateInputValue(date);
}

function todayDateInput(): string {
  return toDateInputValue(new Date());
}

function toDateInputValue(date: Date): string {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

interface Props {
  stage: TenderStage;
  projectId: string;
  client: GraphQLClient;
  isFirstStage: boolean;
  isLast: boolean;
  isAvailable: boolean;
  communicationPanelOpen: boolean;
  onToggleCommunicationPanel: () => void;
}

export function TenderStageRow({
  stage,
  projectId,
  client,
  isFirstStage,
  isLast,
  isAvailable,
  communicationPanelOpen,
  onToggleCommunicationPanel,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [addDocOpen, setAddDocOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<DocumentRecord | null>(
    null,
  );
  const [rowError, setRowError] = useState<string | null>(null);
  const [stageDateModal, setStageDateModal] = useState<'start' | 'edit' | null>(
    null,
  );
  const [stageDateValue, setStageDateValue] = useState('');
  const [collapsedDocumentIds, setCollapsedDocumentIds] = useState<Set<string>>(
    () => new Set(),
  );
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['tenderStages', projectId] });

  const startMutation = useMutation({
    mutationFn: (startedAt: string) =>
      client.request(START_TENDER_STAGE_MUTATION, {
        input: { stageId: stage.id, startedAt },
      }),
    onSuccess: () => {
      setRowError(null);
      setStageDateModal(null);
      invalidate();
    },
    onError: (error: Error) => setRowError(error.message),
  });

  const updateStageMutation = useMutation({
    mutationFn: (startedAt: string) =>
      client.request(UPDATE_TENDER_STAGE_MUTATION, {
        input: { stageId: stage.id, startedAt },
      }),
    onSuccess: () => {
      setRowError(null);
      setStageDateModal(null);
      invalidate();
    },
    onError: (error: Error) => setRowError(error.message),
  });

  const completeMutation = useMutation({
    mutationFn: () =>
      client.request(COMPLETE_TENDER_STAGE_MUTATION, {
        input: { stageId: stage.id },
      }),
    onSuccess: () => {
      setRowError(null);
      invalidate();
    },
    onError: (error: Error) => setRowError(error.message),
  });

  const skipMutation = useMutation({
    mutationFn: () =>
      client.request(SKIP_TENDER_STAGE_MUTATION, {
        input: { stageId: stage.id },
      }),
    onSuccess: () => {
      setRowError(null);
      invalidate();
    },
    onError: (error: Error) => setRowError(error.message),
  });

  const isLocked = stage.status === 'NOT_STARTED' && !isAvailable;
  const isSkipped = stage.status === 'SKIPPED';
  const canManageStageContent = !isLocked && !isSkipped;
  const isPending =
    startMutation.isPending ||
    updateStageMutation.isPending ||
    completeMutation.isPending ||
    skipMutation.isPending;
  const statusStyle = STATUS_STYLES[stage.status] ?? STATUS_STYLES.NOT_STARTED;
  const hasStageDocuments = stage.documents.length > 0;
  const StageIcon = STAGE_ICONS[stage.stage];

  async function openAttachment(attachmentId: string) {
    const result = await client.request<{
      attachmentDownloadUrl: { downloadUrl: string };
    }>(ATTACHMENT_DOWNLOAD_URL_QUERY, { attachmentId });
    window.open(result.attachmentDownloadUrl.downloadUrl, '_blank', 'noopener');
  }

  async function deleteDocument(document: DocumentRecord) {
    if (!window.confirm(`Delete "${document.title}"?`)) return;
    await client.request(DELETE_DOCUMENT_MUTATION, { documentId: document.id });
    invalidate();
  }

  async function renameAttachment(attachment: DocumentAttachment) {
    const fileName = window.prompt('Attachment file name', attachment.fileName);
    if (!fileName || fileName.trim() === attachment.fileName) return;

    await client.request(RENAME_ATTACHMENT_MUTATION, {
      input: {
        attachmentId: attachment.id,
        fileName: fileName.trim(),
      },
    });
    invalidate();
  }

  async function deleteAttachment(attachment: DocumentAttachment) {
    if (!window.confirm(`Delete "${attachment.fileName}"?`)) return;
    await client.request(DELETE_ATTACHMENT_MUTATION, {
      input: { attachmentId: attachment.id },
    });
    invalidate();
  }

  function openStageDateModal(mode: 'start' | 'edit') {
    setRowError(null);
    setStageDateValue(
      mode === 'start'
        ? formatDateInput(stage.startedAt) || todayDateInput()
        : formatDateInput(stage.startedAt),
    );
    setStageDateModal(mode);
  }

  function submitStageDate() {
    if (!stageDateValue) {
      setRowError('Select a start date before saving.');
      return;
    }

    if (stageDateModal === 'start') {
      startMutation.mutate(stageDateValue);
      return;
    }

    if (stageDateModal === 'edit') {
      updateStageMutation.mutate(stageDateValue);
    }
  }

  function toggleDocument(documentId: string) {
    setCollapsedDocumentIds((current) => {
      const next = new Set(current);
      if (next.has(documentId)) {
        next.delete(documentId);
      } else {
        next.add(documentId);
      }
      return next;
    });
  }

  return (
    <div
      className={`grid grid-cols-[40px_minmax(0,1fr)] sm:grid-cols-[48px_minmax(0,1fr)] ${
        isLocked ? 'opacity-60' : ''
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

      {editingDocument && (
        <EditDocumentModal
          document={editingDocument}
          projectId={projectId}
          client={client}
          onClose={() => setEditingDocument(null)}
        />
      )}

      {stageDateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/20 p-4 backdrop-blur-sm">
          <div className="w-full max-w-[380px] rounded bg-surface-container-lowest shadow-popover">
            <div className="flex items-center justify-between border-b border-outline-variant p-4">
              <div>
                <h2 className="text-headline-md font-semibold text-on-surface">
                  {stageDateModal === 'start' ? 'Start Stage' : 'Edit Start Date'}
                </h2>
                <p className="text-label-md text-outline">
                  {STAGE_LABELS[stage.stage]}
                </p>
              </div>
              <button
                onClick={() => setStageDateModal(null)}
                disabled={isPending}
                className="rounded p-1 text-outline transition-colors hover:bg-surface-container disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 p-4">
              <div>
                <label className="mb-1 block text-body-sm font-semibold text-on-surface">
                  Start Date <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
                  <input
                    type="date"
                    value={stageDateValue}
                    onChange={(event) => setStageDateValue(event.target.value)}
                    className="block h-9 w-full rounded border border-outline-variant bg-surface-container-lowest py-2 pl-9 pr-3 text-body-sm text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary-container/40"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-outline-variant pt-4">
                <button
                  type="button"
                  onClick={() => setStageDateModal(null)}
                  disabled={isPending}
                  className="h-8 rounded px-3 text-body-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitStageDate}
                  disabled={isPending}
                  className="flex h-8 items-center gap-1.5 rounded bg-primary px-4 text-body-sm font-semibold text-on-primary transition-colors hover:bg-primary-container disabled:opacity-70"
                >
                  {(startMutation.isPending || updateStageMutation.isPending) && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  {stageDateModal === 'start' ? 'Start' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative flex justify-center">
        {!isFirstStage && (
          <span className="absolute top-0 h-4 w-px bg-outline-variant" />
        )}
        {!isLast && (
          <span className="absolute bottom-0 top-11 w-px bg-outline-variant sm:top-12" />
        )}
        <span
          className={`relative z-10 mt-4 flex h-7 w-7 items-center justify-center rounded-full border bg-surface-container-lowest sm:h-8 sm:w-8 ${
            stage.status === 'IN_PROGRESS'
              ? 'border-primary/40'
              : stage.status === 'COMPLETED'
                ? 'border-[#16a34a]/30'
                : 'border-outline-variant'
          }`}
        >
              {stage.status === 'IN_PROGRESS' ? (
                <Loader2
                  className="h-4 w-4 animate-spin text-primary"
                  style={{ animationDuration: '3s' }}
                />
              ) : stage.status === 'COMPLETED' ? (
                <CheckCircle2 className="h-4 w-4 text-[#16a34a]" />
              ) : (
                <StageIcon
                  className={`h-4 w-4 ${
                    isLocked ? 'text-outline' : 'text-on-surface-variant'
                  }`}
                />
              )}
        </span>
      </div>

      <div
        className={`min-w-0 ${isLast ? '' : 'border-b border-outline-variant'}`}
      >
          <div className="flex min-h-[72px] flex-col gap-3 py-4 pr-3 sm:flex-row sm:items-center sm:pr-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-body-md font-semibold ${
                    isLocked ? 'text-outline' : 'text-on-surface'
                  }`}
                >
                  {STAGE_LABELS[stage.stage]}
                </span>
                <span
                  className={`rounded px-2 py-0.5 text-label-sm font-medium ${statusStyle.badge}`}
                >
                  {statusStyle.label}
                </span>
              </div>
              <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-1 text-label-md text-outline">
                {stage.startedAt && (
                  <span className="inline-flex items-center gap-1">
                    Start: {formatDate(stage.startedAt)}
                    {canManageStageContent && (
                      <button
                        onClick={() => openStageDateModal('edit')}
                        disabled={isPending}
                        className="rounded p-0.5 text-outline transition-colors hover:bg-surface-container-low hover:text-on-surface disabled:opacity-50"
                        title="Edit start date"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                    )}
                  </span>
                )}
                {stage.completedAt && (
                  <span>Completed: {formatDate(stage.completedAt)}</span>
                )}
                {stage.skippedAt && (
                  <span>Skipped: {formatDate(stage.skippedAt)}</span>
                )}
                {isLocked && <span>Locked until required stages are handled</span>}
              </div>
            </div>

            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:flex-shrink-0 sm:justify-end">
              <button
                id={`communications-${stage.id}`}
                onClick={onToggleCommunicationPanel}
                disabled={isPending}
                className={`flex h-7 min-w-7 items-center justify-center gap-1 rounded border px-2 text-label-md font-medium transition-colors disabled:opacity-50 ${
                  communicationPanelOpen
                    ? 'border-primary text-primary'
                    : 'border-outline-variant text-on-surface hover:bg-surface-container-low'
                }`}
                title="Communications"
              >
                <MessagesSquare className="h-3.5 w-3.5" />
                {stage.events.length > 0 && (
                  <span className="min-w-4 text-center text-label-sm font-semibold">
                    {stage.events.length}
                  </span>
                )}
              </button>

              {canManageStageContent && (
                <button
                  id={`add-doc-${stage.id}`}
                  onClick={() => {
                    setExpanded(true);
                    setAddDocOpen(true);
                  }}
                  disabled={isPending}
                  className="flex h-7 items-center gap-1 rounded border border-outline-variant px-2.5 text-label-md font-medium text-on-surface transition-colors hover:bg-surface-container-low disabled:opacity-50"
                >
                  <Plus className="h-3 w-3" />
                  Doc
                </button>
              )}

              {stage.status === 'IN_PROGRESS' && (
                <button
                  id={`complete-stage-${stage.id}`}
                  onClick={() => completeMutation.mutate()}
                  disabled={isPending}
                  className="flex h-7 items-center gap-1.5 rounded bg-primary px-3 text-label-md font-semibold text-on-primary transition-colors hover:bg-primary-container disabled:opacity-70"
                >
                  {completeMutation.isPending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    'Complete'
                  )}
                </button>
              )}

              {stage.status === 'NOT_STARTED' && (
                <>
                  <button
                    id={`skip-stage-${stage.id}`}
                    onClick={() => skipMutation.mutate()}
                    disabled={isPending || isLocked}
                    className="flex h-7 items-center rounded border border-outline-variant px-2.5 text-label-md font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low disabled:opacity-50"
                  >
                    {skipMutation.isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      'Skip'
                    )}
                  </button>
                  <button
                    id={`start-stage-${stage.id}`}
                    onClick={() => openStageDateModal('start')}
                    disabled={isPending || isLocked}
                    className="flex h-7 items-center gap-1.5 rounded border border-primary px-3 text-label-md font-semibold text-primary transition-colors hover:bg-surface-container-low disabled:opacity-50"
                  >
                    {startMutation.isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      'Start'
                    )}
                  </button>
                </>
              )}

              <button
                onClick={() => setExpanded(!expanded)}
                className="ml-1 rounded p-1 text-outline transition-colors hover:bg-surface-container-low"
                title={expanded ? 'Collapse stage' : 'Expand stage'}
              >
                {expanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {rowError && (
            <div className="border-t border-outline-variant px-4 py-2">
              <p className="rounded border border-error/20 bg-error/10 p-2 text-body-sm text-error">
                {rowError}
              </p>
            </div>
          )}

          {expanded && (
            <div className="space-y-2 border-t border-outline-variant pb-4 pr-3 pt-3 sm:pr-4">
              <p className="text-label-md font-semibold uppercase text-outline">
                Stage Documents
              </p>
              {hasStageDocuments ? (
                stage.documents.map((document) => renderDocument(document))
              ) : (
                <p className="rounded border border-dashed border-outline-variant px-3 py-2 text-body-sm text-outline">
                  No stage documents added.
                </p>
              )}
            </div>
          )}
      </div>
    </div>
  );

  function renderDocument(document: DocumentRecord, nested = false) {
    const documentIcon = getDocumentIcon(document);
    const DocumentIcon = documentIcon.icon;
    const isDocumentCollapsed = collapsedDocumentIds.has(document.id);

    return (
      <div
        key={document.id}
        className={`rounded border border-outline-variant bg-surface-container-lowest text-body-sm ${
          nested ? 'ml-0' : ''
        }`}
      >
        <div className="flex items-center gap-2 px-3 py-2">
          <button
            type="button"
            onClick={() => toggleDocument(document.id)}
            className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded text-outline transition-colors hover:bg-surface-container-low hover:text-on-surface"
            title={isDocumentCollapsed ? 'Expand document' : 'Collapse document'}
          >
            {isDocumentCollapsed ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronUp className="h-3.5 w-3.5" />
            )}
          </button>
          <DocumentIcon
            className={`h-4 w-4 flex-shrink-0 ${documentIcon.className}`}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-on-surface">{document.title}</span>
              {document.documentDate && (
                <span className="text-label-sm text-outline">
                  {formatDate(document.documentDate)}
                </span>
              )}
            </div>
            {document.description && (
              <p className="mt-0.5 text-label-md text-on-surface-variant">
                {document.description}
              </p>
            )}
          </div>
          {canManageStageContent && (
            <div className="grid w-[88px] flex-shrink-0 grid-cols-3 justify-items-center gap-1">
              <span />
              <button
                onClick={() => setEditingDocument(document)}
                className="flex h-6 w-6 items-center justify-center rounded text-outline transition-colors hover:bg-surface-container hover:text-on-surface"
                title="Edit document"
              >
                <Edit className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => deleteDocument(document)}
                className="flex h-6 w-6 items-center justify-center rounded text-error transition-colors hover:bg-error/10"
                title="Delete document"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {!isDocumentCollapsed && document.attachments.length > 0 ? (
          <div className="border-t border-outline-variant">
            {document.attachments.map((attachment) => (
              <AttachmentRow key={attachment.id} attachment={attachment} />
            ))}
          </div>
        ) : !isDocumentCollapsed ? (
          <p className="border-t border-outline-variant px-11 py-2 text-label-sm italic text-outline">
            No attachment uploaded
          </p>
        ) : null}
      </div>
    );
  }

  function AttachmentRow({ attachment }: { attachment: DocumentAttachment }) {
    const attachmentIcon = getAttachmentIcon(attachment.fileName);
    const AttachmentIcon = attachmentIcon.icon;

    return (
      <div className="flex flex-wrap items-center gap-2 px-3 py-2 text-label-md sm:flex-nowrap sm:px-11 [&+&]:border-t [&+&]:border-outline-variant/70">
        <AttachmentIcon
          className={`h-4 w-4 flex-shrink-0 ${attachmentIcon.className}`}
        />
        <span className="min-w-0 flex-1 truncate text-on-surface">
          {attachment.fileName}
        </span>
        <span className="hidden w-16 flex-shrink-0 text-right text-label-sm text-outline sm:block">
          {attachmentIcon.label}
        </span>
        <span className="w-16 flex-shrink-0 text-right text-label-sm text-outline sm:w-20">
          {attachment.sizeBytes ? formatBytes(attachment.sizeBytes) : ''}
        </span>
        <div className="grid w-[88px] flex-shrink-0 grid-cols-3 justify-items-center gap-1">
          <button
            onClick={() => openAttachment(attachment.id)}
            className="flex h-6 w-6 items-center justify-center rounded text-outline transition-colors hover:bg-surface-container hover:text-on-surface"
            title="View attachment"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
          {canManageStageContent ? (
            <>
              <button
                onClick={() => renameAttachment(attachment)}
                className="flex h-6 w-6 items-center justify-center rounded text-outline transition-colors hover:bg-surface-container hover:text-on-surface"
                title="Rename attachment"
              >
                <Edit className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => deleteAttachment(attachment)}
                className="flex h-6 w-6 items-center justify-center rounded text-error transition-colors hover:bg-error/10"
                title="Delete attachment"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <>
              <span />
              <span />
            </>
          )}
        </div>
      </div>
    );
  }
}
