"use client";

import { useRef, useState } from "react";
import type { ProjectFile } from "@/lib/admin/types";
import { AdminButton } from "@/components/admin/ui/AdminPrimitives";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB, límite razonable para mock en localStorage

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
  currentRole,
  onUpload,
}: {
  files: ProjectFile[];
  currentRole: "admin" | "client";
  onUpload: (file: Omit<ProjectFile, "id" | "uploadedAt">) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);

  function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setError(null);
    const file = fileList[0];
    if (file.size > MAX_FILE_SIZE) {
      setError("El archivo supera el límite de 5MB (demo local).");
      return;
    }
    setIsReading(true);
    const reader = new FileReader();
    reader.onload = () => {
      onUpload({
        name: file.name,
        size: file.size,
        mimeType: file.type || "application/octet-stream",
        uploadedBy: currentRole,
        dataUrl: reader.result as string,
      });
      setIsReading(false);
    };
    reader.onerror = () => {
      setError("No se pudo leer el archivo.");
      setIsReading(false);
    };
    reader.readAsDataURL(file);
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
          disabled={isReading}
        >
          {isReading ? "Subiendo..." : "Elegir archivo"}
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
              href={file.dataUrl}
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
