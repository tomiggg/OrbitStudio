"use client";

import { useState } from "react";
import { useProject } from "@/hooks/useAdminStore";
import { useMounted } from "@/hooks/useMounted";
import { isPortalUnlocked } from "@/lib/admin/portal-session";
import { addComment } from "@/lib/admin/store";
import { prepareAttachment } from "@/lib/admin/files";
import { STAGE_META } from "@/lib/admin/stages";
import { formatDate } from "@/lib/admin/format";
import { AccessGate } from "./AccessGate";
import { PortalShell } from "./PortalShell";
import { StageStepper } from "@/components/admin/StageStepper";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { AttachmentList } from "@/components/admin/AttachmentList";
import { CommentThread } from "@/components/admin/CommentThread";

export function ProjectStatusView({ id }: { id: string }) {
  const project = useProject(id);
  const mounted = useMounted();
  const [manuallyUnlocked, setManuallyUnlocked] = useState(false);
  const unlocked = mounted && (isPortalUnlocked(id) || manuallyUnlocked);

  if (!project) {
    return (
      <PortalShell>
        <div className="border border-[color:rgba(250,252,252,0.15)] px-6 py-16 text-center">
          <p className="font-mono text-[11px] uppercase tracking-wide text-[color:rgba(250,252,252,0.45)]">
            No encontramos este proyecto. Verificá el link que te compartimos.
          </p>
        </div>
      </PortalShell>
    );
  }

  if (!unlocked) {
    return (
      <PortalShell>
        <AccessGate
          projectId={id}
          clientLabel={project.clientCompany || project.clientName}
          onUnlock={() => setManuallyUnlocked(true)}
        />
      </PortalShell>
    );
  }

  async function handleClientComment(body: string, files: File[]) {
    const attachments = await Promise.all(
      files.map(async (file) => {
        const prepared = await prepareAttachment(file);
        return { ...prepared, uploadedBy: "client" as const };
      })
    );
    addComment(id, {
      author: "client",
      authorName: project!.clientName,
      body,
      attachments,
    });
  }

  return (
    <PortalShell>
      <div className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--teal)]">
          {project.clientCompany || project.clientName}
        </p>
        <h1 className="mt-1 font-title text-3xl uppercase tracking-[-0.02em]">{project.title}</h1>
        {project.summary ? (
          <p className="mt-2 text-sm leading-relaxed text-[color:rgba(250,252,252,0.65)]">{project.summary}</p>
        ) : null}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <StatusBadge status={project.status} />
          <span className="font-mono text-[10px] uppercase tracking-wide text-[color:rgba(250,252,252,0.4)]">
            Etapa actual: {STAGE_META[project.stage].label}
          </span>
          {project.dueAt ? (
            <span className="font-mono text-[10px] uppercase tracking-wide text-[color:rgba(250,252,252,0.4)]">
              Entrega estimada: {formatDate(project.dueAt)}
            </span>
          ) : null}
        </div>
        <div className="mt-4 h-1.5 w-full bg-[color:rgba(250,252,252,0.12)]">
          <div className="h-1.5 bg-[color:var(--teal)]" style={{ width: `${project.progressPct}%` }} />
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <section>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.15em] text-[color:rgba(250,252,252,0.5)]">
            Progreso del proyecto
          </p>
          <StageStepper stage={project.stage} history={project.stageHistory} />
        </section>

        <section>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.15em] text-[color:rgba(250,252,252,0.5)]">
            Archivos compartidos
          </p>
          <AttachmentList attachments={project.attachments} />
        </section>

        <section>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.15em] text-[color:rgba(250,252,252,0.5)]">
            Comentarios
          </p>
          <div className="border border-[color:rgba(250,252,252,0.12)] p-4">
            <CommentThread
              comments={project.comments}
              currentAuthor="client"
              onSubmit={handleClientComment}
              placeholder="Dejá un comentario o pedido para el equipo…"
            />
          </div>
        </section>
      </div>
    </PortalShell>
  );
}
