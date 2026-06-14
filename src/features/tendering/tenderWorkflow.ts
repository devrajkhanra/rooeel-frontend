import type { TenderStage, TenderStageType } from '../../types/tendering.types';

const STAGE_DEPENDENCIES: Record<TenderStageType, TenderStageType[]> = {
  TENDER_RECEIVED: [],
  SITE_VISIT: ['TENDER_RECEIVED'],
  PREBID_QUERY: ['TENDER_RECEIVED'],
  TENDER_SUBMISSION: ['SITE_VISIT', 'PREBID_QUERY'],
  CLARIFICATION: ['TENDER_SUBMISSION'],
  AUCTION: ['CLARIFICATION'],
  NEGOTIATION: ['AUCTION'],
  LOI_AWARDED: ['NEGOTIATION'],
};

export function isTenderStageHandled(stage: TenderStage | undefined) {
  return stage?.status === 'COMPLETED' || stage?.status === 'SKIPPED';
}

export function isTenderStageAvailable(
  stage: TenderStage | undefined,
  stages: TenderStage[] | undefined,
) {
  if (!stage) return false;

  const dependencies = STAGE_DEPENDENCIES[stage.stage];
  if (dependencies.length === 0) return true;

  return dependencies.every((requiredStageType) =>
    isTenderStageHandled(
      stages?.find((candidate) => candidate.stage === requiredStageType),
    ),
  );
}
