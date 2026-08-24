"use client";

import { useRef, useState } from "react";
import { AdminButton } from "@/components/admin/ui/AdminPrimitives";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB, ver src/lib/admin/uploadValidation.ts

type FileListItem = {
  id: string;
  name: string;
  size: number;
  uploadedBy: "admin" | "client";
  uploadedAt: string;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

export function FileUploadPanel({
  files,
  onUpload,
  getDownloadUrl,
}: {
  files: FileListItem[];
  onUpload: (file: File) => Promise<void>;
  getDownloadUrl: (fileId: string) => string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setError(null);
    const file = fileList[0];
    if (file.size > MAX_FILE_SIZE) {
      setError("El archivo supera el límite de 20MB.");
      return;
    }
    setUploading(true);
    try {
      await onUpload(file);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo subir el archivo.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className="flex flex-col items-center justify-center gap-2 border border-dashed border-[var(--teal)]/40 px-4 py-6 text-center"
      >
        <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--teal)]/70">
          Arrastrá un archivo o
        </p>
        <AdminButton
          variant="ghost"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "Subiendo..." : "Elegir archivo"}
        </AdminButton>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {error && <p className="font-mono text-[10px] text-red-400">{error}</p>}
      <ul className="flex flex-col gap-2">
        {files.length === 0 && (
          <li className="font-mono text-xs text-white/40">
            Sin archivos adjuntos todavía.
          </li>
        )}
        {files.map((file) => (
          <li
            key={file.id}
            className="flex items-center justify-between gap-3 border border-white/10 px-3 py-2"
          >
            <a
              href={getDownloadUrl(file.id)}
              download={file.name}
              className="min-w-0 flex-1 truncate text-sm text-white hover:text-[var(--teal)]"
            >
              {file.name}
            </a>
            <span className="shrink-0 font-mono text-[9px] uppercase tracking-widest text-white/40">
              {file.uploadedBy === "admin" ? "Shift Studio" : "Cliente"} · {formatSize(file.size)} · {formatDate(file.uploadedAt)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
