import type { AttachmentKind } from "./types";
import { formatBytes } from "./format";

const INLINE_PREVIEW_LIMIT = 1.5 * 1024 * 1024; // 1.5MB — techo del mock en localStorage

export function kindFromMime(type: string): AttachmentKind {
  if (type.startsWith("image/")) return "image";
  if (type === "application/pdf") return "pdf";
  if (type.includes("word") || type.includes("document")) return "doc";
  return "other";
}

export type PreparedAttachment = {
  name: string;
  sizeLabel: string;
  kind: AttachmentKind;
  dataUrl?: string;
};

export function prepareAttachment(file: File): Promise<PreparedAttachment> {
  const base = {
    name: file.name,
    sizeLabel: formatBytes(file.size),
    kind: kindFromMime(file.type),
  };

  if (file.size > INLINE_PREVIEW_LIMIT) {
    // Mock sin backend de storage: guardamos solo metadata para archivos grandes.
    return Promise.resolve(base);
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ ...base, dataUrl: reader.result as string });
    reader.onerror = () => resolve(base);
    reader.readAsDataURL(file);
  });
}
