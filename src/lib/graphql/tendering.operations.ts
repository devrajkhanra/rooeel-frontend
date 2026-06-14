const DOCUMENT_FRAGMENT = `
  id
  projectId
  ownerType
  ownerId
  title
  description
  documentDate
  status
  attachments {
    id
    projectId
    documentId
    objectKey
    fileName
    contentType
    sizeBytes
    uploadedById
    uploadedAt
  }
`;

const STAGE_EVENT_FRAGMENT = `
  id
  projectId
  stageId
  eventType
  title
  eventDate
  note
  sequence
  createdAt
  updatedAt
  documents {
    ${DOCUMENT_FRAGMENT}
  }
`;

const STAGE_FRAGMENT = `
  id
  projectId
  stage
  sequence
  status
  note
  startedAt
  completedAt
  skippedAt
  createdAt
  updatedAt
  documents {
    ${DOCUMENT_FRAGMENT}
  }
  events {
    ${STAGE_EVENT_FRAGMENT}
  }
`;

export const TENDER_STAGES_QUERY = `
  query TenderStages {
    tenderStages {
      ${STAGE_FRAGMENT}
    }
  }
`;

export const TENDER_STAGE_QUERY = `
  query TenderStage($stageId: String!) {
    tenderStage(stageId: $stageId) {
      ${STAGE_FRAGMENT}
    }
  }
`;

export const START_TENDER_STAGE_MUTATION = `
  mutation StartTenderStage($input: UpdateTenderStageInput!) {
    startTenderStage(input: $input) {
      ${STAGE_FRAGMENT}
    }
  }
`;

export const UPDATE_TENDER_STAGE_MUTATION = `
  mutation UpdateTenderStage($input: UpdateTenderStageInput!) {
    updateTenderStage(input: $input) {
      ${STAGE_FRAGMENT}
    }
  }
`;

export const COMPLETE_TENDER_STAGE_MUTATION = `
  mutation CompleteTenderStage($input: UpdateTenderStageInput!) {
    completeTenderStage(input: $input) {
      ${STAGE_FRAGMENT}
    }
  }
`;

export const SKIP_TENDER_STAGE_MUTATION = `
  mutation SkipTenderStage($input: UpdateTenderStageInput!) {
    skipTenderStage(input: $input) {
      ${STAGE_FRAGMENT}
    }
  }
`;

export const CREATE_TENDER_STAGE_DOCUMENT_MUTATION = `
  mutation CreateTenderStageDocument($input: CreateTenderStageDocumentInput!) {
    createTenderStageDocument(input: $input) {
      ${DOCUMENT_FRAGMENT}
    }
  }
`;

export const CREATE_TENDER_STAGE_EVENT_MUTATION = `
  mutation CreateTenderStageEvent($input: CreateTenderStageEventInput!) {
    createTenderStageEvent(input: $input) {
      ${STAGE_EVENT_FRAGMENT}
    }
  }
`;

export const UPDATE_TENDER_STAGE_EVENT_MUTATION = `
  mutation UpdateTenderStageEvent($input: UpdateTenderStageEventInput!) {
    updateTenderStageEvent(input: $input) {
      ${STAGE_EVENT_FRAGMENT}
    }
  }
`;

export const DELETE_TENDER_STAGE_EVENT_MUTATION = `
  mutation DeleteTenderStageEvent($input: DeleteTenderStageEventInput!) {
    deleteTenderStageEvent(input: $input)
  }
`;

export const CREATE_TENDER_STAGE_EVENT_DOCUMENT_MUTATION = `
  mutation CreateTenderStageEventDocument($input: CreateTenderStageEventDocumentInput!) {
    createTenderStageEventDocument(input: $input) {
      ${DOCUMENT_FRAGMENT}
    }
  }
`;
