import type { GraphQLClient } from 'graphql-request';
import {
  CONFIRM_ATTACHMENT_UPLOAD_MUTATION,
  REQUEST_ATTACHMENT_UPLOAD_MUTATION,
} from '../../lib/graphql/documents.operations';

export async function uploadDocumentAttachments(
  client: GraphQLClient,
  documentId: string,
  files: File[],
) {
  for (const file of files) {
    const upload = await client.request<{
      requestAttachmentUpload: {
        objectKey: string;
        uploadUrl: string;
      };
    }>(REQUEST_ATTACHMENT_UPLOAD_MUTATION, {
      input: {
        documentId,
        fileName: file.name,
        contentType: file.type || 'application/octet-stream',
        sizeBytes: file.size,
      },
    });

    const uploadResponse = await fetch(upload.requestAttachmentUpload.uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload ${file.name}.`);
    }

    await client.request(CONFIRM_ATTACHMENT_UPLOAD_MUTATION, {
      input: {
        documentId,
        objectKey: upload.requestAttachmentUpload.objectKey,
        fileName: file.name,
        contentType: file.type || 'application/octet-stream',
        sizeBytes: file.size,
      },
    });
  }
}
