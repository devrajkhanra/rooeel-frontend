export const REQUEST_ATTACHMENT_UPLOAD_MUTATION = `
  mutation RequestAttachmentUpload($input: RequestAttachmentUploadInput!) {
    requestAttachmentUpload(input: $input) {
      objectKey
      uploadUrl
      expiresInSeconds
    }
  }
`;

export const CONFIRM_ATTACHMENT_UPLOAD_MUTATION = `
  mutation ConfirmAttachmentUpload($input: ConfirmAttachmentUploadInput!) {
    confirmAttachmentUpload(input: $input) {
      id
      documentId
      fileName
      contentType
      sizeBytes
      uploadedAt
    }
  }
`;

export const ATTACHMENT_DOWNLOAD_URL_QUERY = `
  query AttachmentDownloadUrl($attachmentId: String!) {
    attachmentDownloadUrl(attachmentId: $attachmentId) {
      downloadUrl
      expiresInSeconds
    }
  }
`;

export const UPDATE_DOCUMENT_MUTATION = `
  mutation UpdateDocument($input: UpdateDocumentInput!) {
    updateDocument(input: $input) {
      id
      title
      description
      documentDate
      status
    }
  }
`;

export const DELETE_DOCUMENT_MUTATION = `
  mutation DeleteDocument($documentId: String!) {
    deleteDocument(documentId: $documentId)
  }
`;
