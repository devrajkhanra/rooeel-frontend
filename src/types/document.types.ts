export interface DocumentAttachment {
  id: string;
  projectId: string;
  documentId: string;
  objectKey: string;
  fileName: string;
  contentType: string;
  sizeBytes?: number;
  uploadedById?: string;
  uploadedAt: string;
}

export interface DocumentRecord {
  id: string;
  projectId: string;
  ownerType: string;
  ownerId: string;
  title: string;
  description?: string;
  documentDate?: string;
  status: string;
  attachments: DocumentAttachment[];
}

export interface PresignedUpload {
  objectKey: string;
  uploadUrl: string;
  expiresInSeconds: number;
}

export interface PresignedDownload {
  downloadUrl: string;
  expiresInSeconds: number;
}
