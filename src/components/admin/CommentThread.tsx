"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { ProjectComment } from "@/lib/admin/types";
import { AdminButton, AdminTextarea } from "@/components/admin/ui/AdminPrimitives";
import { ClientDate } from "@/components/admin/ClientDate";

const EASE = [0.22, 1, 0.36, 1] as const;

function formatAbsolute(iso: string) {
  return new Date(iso).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelative(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "ahora";
  if (diffMin < 60) return `hace ${diffMin}m`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `hace ${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `hace ${diffDays}d`;
  return formatAbsolute(iso);
}

export function CommentThread({
  comments,
  currentRole,
  currentName,
  onSend,
}: {
  comments: ProjectComment[];
  currentRole: "admin" | "client";
  currentName: string;
  onSend: (body: string) => Promise<void>;
}) {
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [comments.length]);

  async function handleSend() {
    const trimmed = draft.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setError(null);
    try {
      await onSend(trimmed);
      setDraft("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo enviar el comentario.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div ref={scrollRef} className="flex max-h-96 flex-col gap-3 overflow-y-auto pr-1">
        {comments.length === 0 && (
          <p className="font-mono text-xs text-white/40">
            Todavía no hay comentarios en este proyecto.
          </p>
        )}
        {comments.map((comment, i) => {
          const isMine = comment.author === currentRole;
          return (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: EASE, delay: i === comments.length - 1 ? 0.05 : 0 }}
              className={`max-w-[85%] border px-3 py-2.5 ${
                isMine
                  ? "self-end border-[var(--teal)] bg-[var(--teal)]/10"
                  : "self-start border-white/15 bg-white/5"
              }`}
            >
              <div className="mb-1 flex items-center justify-between gap-4">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--teal)]">
                  {comment.authorName}
                </span>
                <ClientDate
                  iso={comment.createdAt}
                  format={formatRelative}
                  titleFormat={formatAbsolute}
                  className="font-mono text-[9px] text-white/40"
                />
              </div>
              <p className="text-sm text-white/90">{comment.body}</p>
            </motion.div>
          );
        })}
      </div>
      <div className="flex flex-col gap-2 border-t border-white/10 pt-3">
        <AdminTextarea
          rows={2}
          value={draft}
          placeholder={`Escribir como ${currentName}...`}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        {error && <p className="font-mono text-[10px] text-red-400">{error}</p>}
        <AdminButton className="self-end" onClick={handleSend} disabled={!draft.trim() || sending}>
          {sending ? "Enviando..." : "Enviar"}
        </AdminButton>
      </div>
    </div>
  );
}
