import type { DocumentRecord } from './document.types';

export type TenderStageType =
  | 'TENDER_RECEIVED'
  | 'SITE_VISIT'
  | 'PREBID_QUERY'
  | 'TENDER_SUBMISSION'
  | 'CLARIFICATION'
  | 'AUCTION'
  | 'NEGOTIATION'
  | 'LOI_AWARDED';

export type TenderStageStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'SKIPPED';

export type TenderStageEventType =
  | 'TENDER_RECEIVED'
  | 'SITE_VISIT'
  | 'PREBID_QUERY_SENT'
  | 'PREBID_QUERY_RESPONSE'
  | 'TENDER_TECHNICAL_SUBMISSION'
  | 'TENDER_PRICE_SUBMISSION'
  | 'CLARIFICATION_SENT'
  | 'CLARIFICATION_RECEIVED'
  | 'AUCTION'
  | 'NEGOTIATION'
  | 'LOI_AWARDED';

export interface TenderStageEvent {
  id: string;
  projectId: string;
  stageId: string;
  eventType: TenderStageEventType;
  eventDate: string;
  note?: string;
  sequence: number;
  createdAt: string;
  updatedAt: string;
  documents: DocumentRecord[];
}

export interface TenderStage {
  id: string;
  projectId: string;
  stage: TenderStageType;
  sequence: number;
  status: TenderStageStatus;
  note?: string;
  startedAt?: string;
  completedAt?: string;
  skippedAt?: string;
  createdAt: string;
  updatedAt: string;
  documents: DocumentRecord[];
  events: TenderStageEvent[];
}

/** Human-readable labels for each stage type */
export const STAGE_LABELS: Record<TenderStageType, string> = {
  TENDER_RECEIVED: 'Tender Received',
  SITE_VISIT: 'Site Visit',
  PREBID_QUERY: 'Pre-Bid Query',
  TENDER_SUBMISSION: 'Tender Submission',
  CLARIFICATION: 'Clarification',
  AUCTION: 'Auction',
  NEGOTIATION: 'Negotiation',
  LOI_AWARDED: 'LOI Awarded',
};

/** Allowed event types per stage */
export const ALLOWED_EVENT_TYPES: Record<TenderStageType, TenderStageEventType[]> = {
  TENDER_RECEIVED: ['TENDER_RECEIVED'],
  SITE_VISIT: ['SITE_VISIT'],
  PREBID_QUERY: ['PREBID_QUERY_SENT', 'PREBID_QUERY_RESPONSE'],
  TENDER_SUBMISSION: ['TENDER_TECHNICAL_SUBMISSION', 'TENDER_PRICE_SUBMISSION'],
  CLARIFICATION: ['CLARIFICATION_SENT', 'CLARIFICATION_RECEIVED'],
  AUCTION: ['AUCTION'],
  NEGOTIATION: ['NEGOTIATION'],
  LOI_AWARDED: ['LOI_AWARDED'],
};
