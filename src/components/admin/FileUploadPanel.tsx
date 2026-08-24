"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { AdminButton } from "@/components/admin/ui/AdminPrimitives";
import { ClientDate } from "@/components/admin/ClientDate";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB, ver src/lib/admin/uploadValidation.ts
const EASE = [0.22, 1, 0.36, 1] as const;

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

function fileKind(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["pdf"].includes(ext)) return "PDF";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)) return "IMG";
  if (["zip", "rar", "7z"].includes(ext)) return "ZIP";
  if (["doc", "docx"].includes(ext)) return "DOC";
  if (["xls", "xlsx", "csv"].includes(ext)) return "XLS";
  if (["ppt", "pptx"].includes(ext)) return "PPT";
  if (["txt", "md"].includes(ext)) return "TXT";
  if (["mp4", "mov", "webm"].includes(ext)) return "VID";
  return "FILE";
}

function uploadWithProgress(
  url: string,
  file: File,
  onProgress: (pct: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
        return;
      }
      let message = `Error ${xhr.status}`;
      try {
        const parsed = JSON.parse(xhr.responseText);
        if (parsed?.error) message = parsed.error;
      } catch {
        // respuesta no era JSON, se usa el mensaje genérico
      }
      reject(new Error(message));
    };
    xhr.onerror = () => reject(new Error("Error de red."));
    const form = new FormData();
    form.append("file", file);
    xhr.send(form);
  });
}

export function FileUploadPanel({
  files,
  uploadUrl,
  onUploaded,
  getDownloadUrl,
}: {
  files: FileListItem[];
  uploadUrl: string;
  onUploaded: () => void;
  getDownloadUrl: (fileId: string) => string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setError(null);
    const file = fileList[0];
    if (file.size > MAX_FILE_SIZE) {
      setError("El archivo supera el límite de 20MB.");
      return;
    }
    setProgress(0);
    try {
      await uploadWithProgress(uploadUrl, file, setProgress);
      onUploaded();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo subir el archivo.");
    } finally {
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const uploading = progress !== null;

  return (
    <div className="flex flex-col gap-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center gap-2 border border-dashed px-4 py-6 text-center transition-colors duration-200 ${
          dragging ? "border-[var(--teal)] bg-[var(--teal)]/10" : "border-[var(--teal)]/40"
        }`}
      >
        <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--teal)]/70">
          {dragging ? "Soltá para subir" : "Arrastrá un archivo o"}
        </p>
        {!dragging && (
          <AdminButton
            variant="ghost"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? `Subiendo... ${progress}%` : "Elegir archivo"}
          </AdminButton>
        )}
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading && (
          <div className="mt-1 h-[2px] w-full max-w-[200px] bg-white/10">
            <motion.div
              className="h-full bg-[var(--teal)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2, ease: EASE }}
            />
          </div>
        )}
      </div>
      {error && <p className="font-mono text-[10px] text-red-400">{error}</p>}
      <ul className="flex flex-col gap-2">
        {files.length === 0 && (
          <li className="border border-dashed border-white/10 px-3 py-4 text-center font-mono text-[10px] uppercase tracking-widest text-white/30">
            Sin archivos adjuntos todavía
          </li>
        )}
        {files.map((file) => (
          <li
            key={file.id}
            className="flex items-center gap-3 border border-white/10 px-3 py-2"
          >
            <span className="shrink-0 border border-[var(--teal)]/40 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-widest text-[var(--teal)]">
              {fileKind(file.name)}
            </span>
            <a
              href={getDownloadUrl(file.id)}
              download={file.name}
              className="min-w-0 flex-1 truncate text-sm text-white hover:text-[var(--teal)]"
            >
              {file.name}
            </a>
            <span className="shrink-0 font-mono text-[9px] uppercase tracking-widest text-white/40">
              {file.uploadedBy === "admin" ? "Shift Studio" : "Cliente"} · {formatSize(file.size)} ·{" "}
              <ClientDate iso={file.uploadedAt} format={formatDate} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
