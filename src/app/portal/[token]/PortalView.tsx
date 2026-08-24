"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useProjectByToken } from "@/lib/admin/useProjects";
import {
  addClientCommentApi,
  fileDownloadUrl,
  markSeenByClientApi,
} from "@/lib/admin/apiClient";
import { hasUnreadForClient } from "@/lib/admin/activity";
import type { PublicProject } from "@/lib/admin/types";
import { StatusStepper } from "@/components/admin/StatusStepper";
import { StatusHistory } from "@/components/admin/StatusHistory";
import { CommentThread } from "@/components/admin/CommentThread";
import { FileUploadPanel } from "@/components/admin/FileUploadPanel";
import { AdminCard, AdminLabel, AdminSkeleton } from "@/components/admin/ui/AdminPrimitives";
import { ToastProvider, useToast } from "@/components/admin/Toaster";
import { FadeIn } from "@/components/admin/FadeIn";
import { Logo } from "@/components/ui/Logo";

const EASE = [0.22, 1, 0.36, 1] as const;

export function PortalView({
  token,
  initialProject,
}: {
  token: string;
  initialProject: PublicProject;
}) {
  return (
    <ToastProvider>
      <PortalContent token={token} initialProject={initialProject} />
    </ToastProvider>
  );
}

function PortalContent({
  token,
  initialProject,
}: {
  token: string;
  initialProject: PublicProject;
}) {
  const toast = useToast();
  const { data: project, notFound: isNotFound, refresh } = useProjectByToken(token, initialProject);
  // Se calcula una sola vez a partir del snapshot inicial (antes de marcar
  // como visto) — si se recalculara con datos ya refrescados, el banner
  // desaparecería solo porque markSeenByClientApi ya actualizó lastSeen.
  const [hadNews] = useState(() => hasUnreadForClient(initialProject));
  const [dismissedNews, setDismissedNews] = useState(false);

  useEffect(() => {
    markSeenByClientApi(token).catch(() => {});
  }, [token]);

  if (isNotFound) {
    notFound();
  }

  if (!project) {
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
          <div className="flex flex-col gap-2">
            <AdminSkeleton className="h-3 w-32" />
            <AdminSkeleton className="h-9 w-64" />
          </div>
          <AdminSkeleton className="h-32 w-full" />
          <AdminSkeleton className="h-40 w-full" />
        </main>
      </div>
    );
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
        <FadeIn>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--teal)]">
              {project.clientName}
            </p>
            <h1 className="font-[family-name:var(--font-title)] text-3xl uppercase tracking-tight text-white">
              {project.projectName}
            </h1>
          </div>
        </FadeIn>

        <AnimatePresence>
          {hadNews && !dismissedNews && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="flex items-center justify-between gap-3 border border-[var(--teal)] bg-[var(--teal)]/10 px-4 py-3"
            >
              <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--teal)]">
                Hay novedades desde tu última visita
              </p>
              <button
                onClick={() => setDismissedNews(true)}
                className="font-mono text-[10px] uppercase tracking-widest text-white/50 hover:text-white"
              >
                Cerrar
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <FadeIn delay={0.05}>
          <AdminCard className="p-5">
            <AdminLabel>Estado actual</AdminLabel>
            <div className="mt-4">
              <StatusStepper status={project.status} />
            </div>
          </AdminCard>
        </FadeIn>

        <FadeIn delay={0.1}>
          <AdminCard className="p-5">
            <AdminLabel>Historial de estado</AdminLabel>
            <div className="mt-4">
              <StatusHistory history={project.statusHistory} />
            </div>
          </AdminCard>
        </FadeIn>

        <FadeIn delay={0.15}>
          <AdminCard className="p-5">
            <AdminLabel>Comentarios</AdminLabel>
            <p className="mb-4 mt-1 text-xs text-white/50">
              Dejá tus comentarios o dudas sobre el avance del proyecto.
            </p>
            <CommentThread
              comments={project.comments}
              currentRole="client"
              currentName={project.clientName}
              onSend={async (body) => {
                await addClientCommentApi(token, body);
                refresh();
              }}
            />
          </AdminCard>
        </FadeIn>

        <FadeIn delay={0.2}>
          <AdminCard className="p-5">
            <AdminLabel>Archivos</AdminLabel>
            <p className="mb-4 mt-1 text-xs text-white/50">
              Subí archivos de referencia o descargá entregables.
            </p>
            <FileUploadPanel
              files={project.files}
              uploadUrl={`/api/portal/projects/${token}/files`}
              onUploaded={() => {
                refresh();
                toast("Archivo subido", "success");
              }}
              getDownloadUrl={(fileId) => fileDownloadUrl(project.id, fileId)}
            />
          </AdminCard>
        </FadeIn>
      </main>
    </div>
  );
}
