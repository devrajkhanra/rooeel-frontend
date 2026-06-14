import { useState } from "react";
import { X, Loader2, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CREATE_TENDER_STAGE_EVENT_MUTATION,
  CREATE_TENDER_STAGE_EVENT_DOCUMENT_MUTATION,
  UPDATE_TENDER_STAGE_EVENT_MUTATION,
} from "../../lib/graphql/tendering.operations";
import { dateInputToIso } from "./dateInput";
import { uploadDocumentAttachments } from "./documentUpload";
import {
  ALLOWED_EVENT_TYPES,
  EVENT_TYPE_LABELS,
  type TenderStage,
  type TenderStageEvent,
  type TenderStageEventType,
} from "../../types/tendering.types";
import type { GraphQLClient } from "graphql-request";

const schema = z.object({
  eventType: z.string().min(1, "Communication type is required"),
  title: z.string().optional(),
  eventDate: z.string().min(1, "Date is required"),
  note: z.string().optional(),
  documentTitle: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  stage: TenderStage;
  projectId: string;
  client: GraphQLClient;
  event?: TenderStageEvent;
  onClose: () => void;
}

export function TenderEventModal({
  stage,
  projectId,
  client,
  event,
  onClose,
}: Props) {
  const queryClient = useQueryClient();
  const allowedTypes = ALLOWED_EVENT_TYPES[stage.stage] ?? [];
  const defaultEventType = event?.eventType ?? allowedTypes[0];
  const isEditing = Boolean(event);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      eventType: defaultEventType ?? "",
      title: event?.title ?? "",
      eventDate: event?.eventDate ? event.eventDate.slice(0, 10) : "",
      note: event?.note ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      let savedEvent: TenderStageEvent;

      if (event) {
        const result = await client.request<{
          updateTenderStageEvent: TenderStageEvent;
        }>(UPDATE_TENDER_STAGE_EVENT_MUTATION, {
          input: {
            eventId: event.id,
            title: values.title || undefined,
            eventDate: values.eventDate,
            note: values.note || undefined,
          },
        });
        savedEvent = result.updateTenderStageEvent;
      } else {
        const selectedEventType = (values.eventType || defaultEventType) as
          | TenderStageEventType
          | undefined;
        if (!selectedEventType) {
          throw new Error(
            `No communication type is configured for ${stage.stage}.`,
          );
        }

        const result = await client.request<{
          createTenderStageEvent: TenderStageEvent;
        }>(CREATE_TENDER_STAGE_EVENT_MUTATION, {
          input: {
            stageId: stage.id,
            eventType: selectedEventType,
            title: values.title || undefined,
            eventDate: values.eventDate,
            note: values.note || undefined,
          },
        });
        savedEvent = result.createTenderStageEvent;
      }

      if (selectedFiles.length > 0) {
        const selectedEventType = (values.eventType ||
          savedEvent.eventType ||
          defaultEventType) as TenderStageEventType;
        const typeLabel =
          EVENT_TYPE_LABELS[selectedEventType] ?? "Communication";
        const documentTitle =
          values.documentTitle?.trim() ||
          values.title?.trim() ||
          `${typeLabel} Documents`;
        const result = await client.request<{
          createTenderStageEventDocument: { id: string };
        }>(CREATE_TENDER_STAGE_EVENT_DOCUMENT_MUTATION, {
          input: {
            eventId: savedEvent.id,
            title: documentTitle,
            documentDate: dateInputToIso(values.eventDate),
            description: values.note || undefined,
          },
        });
        await uploadDocumentAttachments(
          client,
          result.createTenderStageEventDocument.id,
          selectedFiles,
        );
      }

      return savedEvent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenderStages", projectId] });
      onClose();
    },
    onError: (error: Error) => {
      setError("root", {
        message: error.message ?? "Failed to save communication.",
      });
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/20 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[480px] rounded bg-surface-container-lowest shadow-popover">
        <div className="flex items-center justify-between border-b border-outline-variant p-4">
          <h2 className="text-headline-md font-semibold text-on-surface">
            {isEditing ? "Edit Communication" : "Add Communication"}
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
              Type
            </label>
            <select
              {...register("eventType")}
              disabled={isEditing}
              className="block h-9 w-full rounded border border-outline-variant bg-surface-container-lowest px-2.5 text-body-sm text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary-container/40 disabled:bg-surface-container-low disabled:text-outline"
            >
              {allowedTypes.map((type) => (
                <option key={type} value={type}>
                  {EVENT_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
            {errors.eventType && (
              <p className="mt-1 text-label-sm text-error">
                {errors.eventType.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-body-sm font-semibold text-on-surface">
              Title <span className="font-normal text-outline">(Optional)</span>
            </label>
            <input
              type="text"
              {...register("title")}
              className="block w-full rounded border border-outline-variant p-2 text-body-sm text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary-container/40"
              placeholder="Short communication subject"
            />
          </div>

          <div>
            <label className="mb-1 block text-body-sm font-semibold text-on-surface">
              Date <span className="text-error">*</span>
            </label>
            <input
              type="date"
              {...register("eventDate")}
              className="block w-full rounded border border-outline-variant p-2 text-body-sm text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary-container/40"
            />
            {errors.eventDate && (
              <p className="mt-1 text-label-sm text-error">
                {errors.eventDate.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-body-sm font-semibold text-on-surface">
              Gist <span className="font-normal text-outline">(Optional)</span>
            </label>
            <textarea
              {...register("note")}
              rows={4}
              className="block w-full resize-none rounded border border-outline-variant p-2 text-body-sm text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary-container/40"
              placeholder="Capture the communication gist..."
            />
          </div>

          <div className="rounded border border-outline-variant bg-surface-container-lowest p-3">
            <div className="mb-3 flex items-center gap-2">
              <Upload className="h-4 w-4 text-primary" />
              <div>
                <p className="text-body-sm font-semibold text-on-surface">
                  Documents
                </p>
                <p className="text-label-md text-outline">
                  Attach supporting files to this communication.
                </p>
              </div>
            </div>

            <input
              type="file"
              multiple
              onChange={(event) =>
                setSelectedFiles(Array.from(event.target.files ?? []))
              }
              className="block w-full rounded border border-outline-variant p-2 text-body-sm text-on-surface file:mr-3 file:rounded file:border-0 file:bg-surface-container-low file:px-3 file:py-1.5 file:text-body-sm file:font-medium file:text-on-surface hover:file:bg-surface-container"
            />

            {selectedFiles.length > 0 && (
              <div className="mt-3 space-y-3">
                <div>
                  <label className="mb-1 block text-label-md font-semibold text-on-surface">
                    Document Title
                  </label>
                  <input
                    type="text"
                    {...register("documentTitle")}
                    className="block w-full rounded border border-outline-variant p-2 text-body-sm text-on-surface outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary-container/40"
                    placeholder="Defaults to communication title"
                  />
                </div>
                <p className="text-label-sm text-outline">
                  {selectedFiles.length} file
                  {selectedFiles.length === 1 ? "" : "s"} selected. Files will
                  be saved under one communication document.
                </p>
              </div>
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
