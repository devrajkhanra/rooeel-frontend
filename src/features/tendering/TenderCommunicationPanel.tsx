import { useState } from 'react';
import { Edit, MoreVertical, Plus, Trash2, X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TenderEventModal } from './TenderEventModal';
import { ATTACHMENT_DOWNLOAD_URL_QUERY } from '../../lib/graphql/documents.operations';
import { DELETE_TENDER_STAGE_EVENT_MUTATION } from '../../lib/graphql/tendering.operations';
import {
  STAGE_LABELS,
  type TenderStage,
  type TenderStageEvent,
} from '../../types/tendering.types';
import type { DocumentAttachment, DocumentRecord } from '../../types/document.types';
import { formatDate, getAttachmentIcon } from './documentDisplay';
import type { GraphQLClient } from 'graphql-request';

interface Props {
  stage: TenderStage;
  projectId: string;
  client: GraphQLClient;
  canManageStageContent: boolean;
  onClose: () => void;
}

export function TenderCommunicationPanel({
  stage,
  projectId,
  client,
  canManageStageContent,
  onClose,
}: Props) {
  const queryClient = useQueryClient();
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TenderStageEvent | null>(null);
  const [communicationMenuEventId, setCommunicationMenuEventId] = useState<
    string | null
  >(null);
  const [panelError, setPanelError] = useState<string | null>(null);
  const timelineEvents = [...stage.events].sort((first, second) => {
    const firstTime = new Date(first.eventDate).getTime();
    const secondTime = new Date(second.eventDate).getTime();
    if (firstTime !== secondTime) return firstTime - secondTime;
    return first.sequence - second.sequence;
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['tenderStages', projectId] });

  const deleteEventMutation = useMutation({
    mutationFn: (eventId: string) =>
      client.request(DELETE_TENDER_STAGE_EVENT_MUTATION, {
        input: { eventId },
      }),
    onSuccess: () => {
      setPanelError(null);
      setCommunicationMenuEventId(null);
      invalidate();
    },
    onError: (error: Error) => setPanelError(error.message),
  });

  async function openAttachment(attachmentId: string) {
    const result = await client.request<{
      attachmentDownloadUrl: { downloadUrl: string };
    }>(ATTACHMENT_DOWNLOAD_URL_QUERY, { attachmentId });
    window.open(result.attachmentDownloadUrl.downloadUrl, '_blank', 'noopener');
  }

  return (
    <aside className="rounded border border-outline-variant bg-surface-container-lowest">
      {(eventModalOpen || editingEvent) && (
        <TenderEventModal
          stage={stage}
          projectId={projectId}
          client={client}
          event={editingEvent ?? undefined}
          onClose={() => {
            setEventModalOpen(false);
            setEditingEvent(null);
          }}
        />
      )}

      <div className="flex min-h-[58px] items-center justify-between gap-3 border-b border-outline-variant px-4 py-3">
        <div className="min-w-0">
          <h3 className="text-body-md font-semibold text-on-surface">
            Communications
          </h3>
          <p className="truncate text-label-md text-outline">
            {STAGE_LABELS[stage.stage]}
          </p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-1">
          {canManageStageContent && (
            <button
              type="button"
              onClick={() => {
                setCommunicationMenuEventId(null);
                setEventModalOpen(true);
              }}
              disabled={deleteEventMutation.isPending}
              className="flex h-7 items-center gap-1 rounded border border-outline-variant px-2 text-label-md font-medium text-on-surface transition-colors hover:bg-surface-container-low disabled:opacity-50"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setCommunicationMenuEventId(null);
              onClose();
            }}
            className="flex h-7 w-7 items-center justify-center rounded text-outline transition-colors hover:bg-surface-container-low hover:text-on-surface"
            title="Close communications"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {panelError && (
        <div className="border-b border-outline-variant px-4 py-2">
          <p className="rounded border border-error/20 bg-error/10 p-2 text-body-sm text-error">
            {panelError}
          </p>
        </div>
      )}

      <div className="no-scrollbar max-h-[calc(100vh-290px)] overflow-y-auto px-4 py-3">
        {timelineEvents.length === 0 ? (
          <p className="py-8 text-center text-body-sm text-outline">
            No communications added.
          </p>
        ) : (
          <div>
            {timelineEvents.map((event, index) =>
              renderCommunicationEvent(event, index),
            )}
          </div>
        )}
      </div>
    </aside>
  );

  function renderCommunicationEvent(
    event: TenderStageEvent,
    eventIndex: number,
  ) {
    const documentsWithAttachments = event.documents.filter(
      (document) => document.attachments.length > 0,
    );
    const isLastEvent = eventIndex === timelineEvents.length - 1;

    return (
      <div
        key={event.id}
        className="grid grid-cols-[16px_minmax(0,1fr)] gap-2 pb-3 last:pb-0"
      >
        <div className="relative flex justify-center">
          {!isLastEvent && (
            <span className="absolute bottom-[-12px] top-3.5 w-px bg-outline-variant" />
          )}
          <span className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
        </div>

        <div className="min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
                {event.title && (
                  <span className="min-w-0 truncate text-body-sm font-semibold text-on-surface">
                    {event.title}
                  </span>
                )}
                <span className="whitespace-nowrap text-label-sm font-medium text-outline">
                  {formatDate(event.eventDate)}
                </span>
              </div>
              {event.note && (
                <p className="mt-0.5 text-body-sm text-on-surface-variant">
                  {event.note}
                </p>
              )}
            </div>

            {canManageStageContent && (
              <div className="relative flex-shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setCommunicationMenuEventId((current) =>
                      current === event.id ? null : event.id,
                    )
                  }
                  className="flex h-7 w-7 items-center justify-center rounded text-outline transition-colors hover:bg-surface-container-low hover:text-on-surface"
                  title="Communication actions"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>

                {communicationMenuEventId === event.id && (
                  <div className="absolute right-0 top-8 z-20 w-32 rounded border border-outline-variant bg-surface-container-lowest py-1 shadow-popover">
                    <button
                      type="button"
                      onClick={() => {
                        setCommunicationMenuEventId(null);
                        setEditingEvent(event);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-label-md text-on-surface transition-colors hover:bg-surface-container-low"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCommunicationMenuEventId(null);
                        if (window.confirm('Delete this communication?')) {
                          deleteEventMutation.mutate(event.id);
                        }
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-label-md text-error transition-colors hover:bg-error/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {documentsWithAttachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {documentsWithAttachments.map((document) =>
                renderCommunicationDocument(document),
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderCommunicationDocument(document: DocumentRecord) {
    return (
      <div key={document.id} className="min-w-0">
        <div className="mb-0.5">
          <span className="block min-w-0 truncate text-label-md font-semibold text-on-surface">
            {document.title}
          </span>
        </div>

        <div className="space-y-0.5">
          {document.attachments.map((attachment) => (
            <CommunicationAttachmentRow
              key={attachment.id}
              attachment={attachment}
            />
          ))}
        </div>
      </div>
    );
  }

  function CommunicationAttachmentRow({
    attachment,
  }: {
    attachment: DocumentAttachment;
  }) {
    const attachmentIcon = getAttachmentIcon(attachment.fileName);
    const AttachmentIcon = attachmentIcon.icon;

    return (
      <button
        type="button"
        onClick={() => openAttachment(attachment.id)}
        className="flex w-full items-center gap-2 rounded py-0.5 text-left text-label-md transition-colors hover:bg-surface-container-low"
      >
        <AttachmentIcon
          className={`h-4 w-4 flex-shrink-0 ${attachmentIcon.className}`}
        />
        <span className="min-w-0 flex-1 truncate text-on-surface">
          {attachment.fileName}
        </span>
      </button>
    );
  }
}
