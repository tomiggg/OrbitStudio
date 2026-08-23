"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { useProjectByToken } from "@/lib/admin/useProjects";
import { addComment, addFile, hasUnreadForClient, markSeenByClient } from "@/lib/admin/store";
import { StatusStepper } from "@/components/admin/StatusStepper";
import { StatusHistory } from "@/components/admin/StatusHistory";
import { CommentThread } from "@/components/admin/CommentThread";
import { FileUploadPanel } from "@/components/admin/FileUploadPanel";
import { AdminCard, AdminLabel } from "@/components/admin/ui/AdminPrimitives";
import { Logo } from "@/components/ui/Logo";

export default function ClientPortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const project = useProjectByToken(token);
  // Render inicial en null a propósito (igual que el origin en
  // PortalLinkCard): se completa recién tras el mount, capturando el
  // estado ANTES de marcar como visto, para poder avisarle al cliente
  // que hubo novedades desde su última visita.
  const [hadUpdates, setHadUpdates] = useState<boolean | null>(null);

  useEffect(() => {
    if (!project) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHadUpdates((prev) => (prev === null ? hasUnreadForClient(project) : prev));
    markSeenByClient(project.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id]);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--dark)] text-white">
      <header className="border-b border-[var(--teal)]/20">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Logo variant="wordmark" theme="dark" size={26} />
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--teal)]">
            Portal cliente
          </span>
        </div>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-5 py-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--teal)]">
            {project!.clientName}
          </p>
          <h1 className="font-[family-name:var(--font-title)] text-3xl uppercase tracking-tight text-white">
            {project!.projectName}
          </h1>
        </div>

        {hadUpdates && (
          <div className="border border-[var(--teal)] bg-[var(--teal)]/10 px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--teal)]">
              Hay novedades desde tu última visita
            </p>
          </div>
        )}

        <AdminCard className="p-5">
          <AdminLabel>Estado actual</AdminLabel>
          <div className="mt-4">
            <StatusStepper status={project!.status} />
          </div>
        </AdminCard>

        <AdminCard className="p-5">
          <AdminLabel>Historial de estado</AdminLabel>
          <div className="mt-4">
            <StatusHistory history={project!.statusHistory} />
          </div>
        </AdminCard>

        <AdminCard className="p-5">
          <AdminLabel>Comentarios</AdminLabel>
          <p className="mb-4 mt-1 text-xs text-white/50">
            Dejá tus comentarios o dudas sobre el avance del proyecto.
          </p>
          <CommentThread
            comments={project!.comments}
            currentRole="client"
            currentName={project!.clientName}
            onSend={(body) => addComment(project!.id, "client", project!.clientName, body)}
          />
        </AdminCard>

        <AdminCard className="p-5">
          <AdminLabel>Archivos</AdminLabel>
          <p className="mb-4 mt-1 text-xs text-white/50">
            Subí archivos de referencia o descargá entregables.
          </p>
          <FileUploadPanel
            files={project!.files}
            currentRole="client"
            onUpload={(file) => addFile(project!.id, file)}
          />
        </AdminCard>
      </main>
    </div>
  );
}
