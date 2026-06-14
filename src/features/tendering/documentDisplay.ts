import {
  FileSpreadsheet,
  FileText,
  FileType,
  Table2,
  type LucideIcon,
} from 'lucide-react';
import type { DocumentRecord } from '../../types/document.types';

const FILE_TYPE_STYLES: Record<
  string,
  { icon: LucideIcon; className: string; label: string }
> = {
  pdf: { icon: FileText, className: 'text-[#dc2626]', label: 'PDF' },
  doc: { icon: FileType, className: 'text-[#2563eb]', label: 'DOC' },
  docx: { icon: FileType, className: 'text-[#2563eb]', label: 'DOCX' },
  xls: { icon: FileSpreadsheet, className: 'text-[#15803d]', label: 'XLS' },
  xlsx: { icon: FileSpreadsheet, className: 'text-[#15803d]', label: 'XLSX' },
  csv: { icon: Table2, className: 'text-[#b45309]', label: 'CSV' },
};

export function formatBytes(bytes?: number): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function getFileExtension(fileName: string): string {
  const parts = fileName.toLowerCase().split('.');
  return parts.length > 1 ? parts.at(-1) ?? '' : '';
}

export function getAttachmentIcon(fileName: string) {
  const extension = getFileExtension(fileName);
  return (
    FILE_TYPE_STYLES[extension] ?? {
      icon: FileText,
      className: 'text-outline',
      label: 'FILE',
    }
  );
}

export function getDocumentIcon(document: DocumentRecord) {
  const extensions = [
    ...new Set(
      document.attachments
        .map((attachment) => getFileExtension(attachment.fileName))
        .filter(Boolean),
    ),
  ];

  if (extensions.length === 1 && FILE_TYPE_STYLES[extensions[0]]) {
    return FILE_TYPE_STYLES[extensions[0]];
  }

  return {
    icon: FileText,
    className: 'text-primary',
    label: 'DOC',
  };
}
