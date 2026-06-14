import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Loader2, ChevronRight, ArrowLeft } from 'lucide-react';
import { createProjectClient } from '../../lib/graphql-client';
import { TENDER_STAGES_QUERY } from '../../lib/graphql/tendering.operations';
import { ACTIVE_PROJECT_QUERY } from '../../lib/graphql/projects.operations';
import { TenderStageRow } from './TenderStageRow';
import { TenderCommunicationPanel } from './TenderCommunicationPanel';
import { isTenderStageAvailable } from './tenderWorkflow';
import type { TenderStage } from '../../types/tendering.types';
import type { Project } from '../../types/project.types';

export function TenderingPage() {
  const { projectId } = useParams({ from: '/dashboard/projects/$projectId/tendering' });
  const navigate = useNavigate();
  const client = createProjectClient(projectId);
  const [communicationStageId, setCommunicationStageId] = useState<string | null>(
    null,
  );

  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const res = await client.request<{ activeProject: Project }>(ACTIVE_PROJECT_QUERY);
      return res.activeProject;
    },
  });

  const { data: stages, isLoading, isError } = useQuery({
    queryKey: ['tenderStages', projectId],
    queryFn: async () => {
      const res = await client.request<{ tenderStages: TenderStage[] }>(TENDER_STAGES_QUERY);
      return res.tenderStages;
    },
  });

  const selectedCommunicationStage =
    stages?.find((stage) => stage.id === communicationStageId) ?? null;
  const canManageSelectedCommunicationStage = selectedCommunicationStage
    ? selectedCommunicationStage.status !== 'SKIPPED' &&
      isTenderStageAvailable(selectedCommunicationStage, stages)
    : false;

  return (
    <div className="min-w-0">
      {/* Breadcrumb */}
      <div className="mb-4 flex flex-wrap items-center gap-2 text-body-sm text-outline">
        <button
          onClick={() => navigate({ to: '/projects' })}
          className="hover:text-on-surface transition-colors"
        >
          Projects
        </button>
        <ChevronRight className="h-4 w-4" />
        <button
          onClick={() => navigate({ to: '/projects/$projectId', params: { projectId } })}
          className="hover:text-on-surface transition-colors"
        >
          {project?.name ?? 'Project'}
        </button>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-on-surface">Tendering</span>
      </div>

      {/* Page Header */}
      <div className="mb-6">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span className="text-label-md font-semibold text-primary uppercase tracking-widest">
            Project Tendering
          </span>
          <span className="text-label-sm text-outline">•</span>
          <span className={`text-label-md font-semibold uppercase tracking-wide ${
            project?.status === 'TENDERING' ? 'text-[#0066cc]' : 'text-outline'
          }`}>
            {project?.status ?? 'ACTIVE'}
          </span>
        </div>
        <h1 className="max-w-full text-headline-lg font-semibold text-on-surface">
          {project?.name ?? 'Loading...'}
        </h1>
      </div>

      <div
        className={`grid gap-4 ${
          selectedCommunicationStage
            ? 'grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px]'
            : 'grid-cols-1'
        }`}
      >
        {/* Stages Section */}
        <div className="rounded border border-outline-variant bg-surface-container-lowest">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant px-3 py-3 sm:px-4">
            <h2 className="text-body-md font-semibold text-on-surface">
              Tendering Stages
            </h2>
            {stages && (
              <span className="rounded-full bg-surface-container px-2.5 py-0.5 text-label-md font-semibold text-on-surface-variant">
                {stages.length} Stages
              </span>
            )}
          </div>

          <div>
            {isLoading ? (
              <div className="flex h-48 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : isError ? (
              <div className="flex h-48 flex-col items-center justify-center gap-3">
                <p className="text-body-sm text-error">
                  Failed to load tendering stages.
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
            ) : (
              stages?.map((stage, index) => (
                <TenderStageRow
                  key={stage.id}
                  stage={stage}
                  projectId={projectId}
                  client={client}
                  isFirstStage={index === 0}
                  isLast={index === stages.length - 1}
                  isAvailable={isTenderStageAvailable(stage, stages)}
                  communicationPanelOpen={communicationStageId === stage.id}
                  onToggleCommunicationPanel={() =>
                    setCommunicationStageId((current) =>
                      current === stage.id ? null : stage.id,
                    )
                  }
                />
              ))
            )}
          </div>
        </div>

        {selectedCommunicationStage && (
          <TenderCommunicationPanel
            stage={selectedCommunicationStage}
            projectId={projectId}
            client={client}
            canManageStageContent={canManageSelectedCommunicationStage}
            onClose={() => setCommunicationStageId(null)}
          />
        )}
      </div>
    </div>
  );
}
