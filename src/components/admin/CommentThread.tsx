"use client";

import { useRef, useState } from "react";
import type { CommentEntry } from "@/lib/admin/types";
import { formatDateTime, initials } from "@/lib/admin/format";
import { AttachmentList } from "./AttachmentList";

type CommentThreadProps = {
  comments: CommentEntry[];
  currentAuthor: "admin" | "client";
  onSubmit: (body: string, files: File[]) => Promise<void> | void;
  placeholder?: string;
};

export function CommentThread({ comments, currentAuthor, onSubmit, placeholder }: CommentThreadProps) {
  const [body, setBody] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() && files.length === 0) return;
    setSending(true);
    try {
      await onSubmit(body.trim(), files);
      setBody("");
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex max-h-[420px] flex-col gap-3 overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <li className="font-mono text-[11px] uppercase tracking-wide text-[color:rgba(250,252,252,0.4)]">
            Todavía no hay mensajes en este proyecto.
          </li>
        ) : (
          comments.map((c) => {
            const mine = c.author === currentAuthor;
            return (
              <li key={c.id} className={`flex gap-3 ${mine ? "flex-row-reverse text-right" : ""}`}>
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-[color:rgba(250,252,252,0.2)] font-mono text-[10px] text-[color:var(--white)]">
                  {initials(c.authorName) || "?"}
                </span>
                <div className={`flex max-w-[85%] flex-col gap-1.5 ${mine ? "items-end" : "items-start"}`}>
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[color:rgba(250,252,252,0.45)]">
                    {c.authorName} · {formatDateTime(c.createdAt)}
                  </span>
                  {c.body ? (
                    <p
                      className={`border px-3 py-2 text-sm leading-relaxed text-[color:var(--white)] ${
                        mine ? "border-[color:var(--teal)] bg-[color:rgba(10,186,181,0.1)]" : "border-[color:rgba(250,252,252,0.15)]"
                      }`}
                    >
                      {c.body}
                    </p>
                  ) : null}
                  {c.attachments.length > 0 ? (
                    <div className="w-full min-w-[220px]">
                      <AttachmentList attachments={c.attachments} />
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })
        )}
      </ul>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 border-t border-[color:rgba(250,252,252,0.12)] pt-4">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={placeholder ?? "Escribí un comentario…"}
          rows={2}
          className="w-full resize-none border border-[color:rgba(250,252,252,0.2)] bg-transparent px-3 py-2 text-sm text-[color:var(--white)] placeholder:text-[color:rgba(250,252,252,0.35)] focus:border-[color:var(--teal)] focus:outline-none"
        />
        <div className="flex items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 font-mono text-[10px] uppercase tracking-wide text-[color:rgba(250,252,252,0.5)] hover:text-[color:var(--teal)]">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            />
            + Adjuntar {files.length > 0 ? `(${files.length})` : ""}
          </label>
          <button
            type="submit"
            disabled={sending || (!body.trim() && files.length === 0)}
            className="border border-[color:var(--teal)] bg-[color:var(--teal)] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-[color:var(--dark)] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          >
            {sending ? "Enviando…" : "Enviar"}
          </button>
        </div>
      </form>
    </div>
  );
}
