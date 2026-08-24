"use client";

import { useState } from "react";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { useProject } from "@/lib/admin/useProjects";
import {
  addAdminCommentApi,
  deleteProjectApi,
  fileDownloadUrl,
  updateNotesApi,
  updateStatusApi,
  uploadAdminFileApi,
} from "@/lib/admin/apiClient";
import type { Project, ProjectStatus } from "@/lib/admin/types";
import { StatusStepper } from "@/components/admin/StatusStepper";
import { CommentThread } from "@/components/admin/CommentThread";
import { FileUploadPanel } from "@/components/admin/FileUploadPanel";
import { PortalLinkCard } from "@/components/admin/PortalLinkCard";
import {
  AdminButton,
  AdminCard,
  AdminLabel,
  AdminTextarea,
} from "@/components/admin/ui/AdminPrimitives";

export function ProjectDetailView({
  id,
  initialProject,
}: {
  id: string;
  initialProject: Project;
}) {
  const { data: project, notFound: isNotFound, refresh } = useProject(id, initialProject);
  const router = useRouter();
  const [notes, setNotes] = useState<string | null>(null);
  const [savingNotes, setSavingNotes] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (isNotFound) {
    notFound();
  }

  if (!project) {
    return <p className="font-mono text-sm text-white/40">Cargando...</p>;
  }

  const notesValue = notes ?? project.notes;

  async function handleStatusChange(status: ProjectStatus) {
    await updateStatusApi(project!.id, status);
    refresh();
  }

  async function handleSaveNotes() {
    setSavingNotes(true);
    try {
      await updateNotesApi(project!.id, notesValue);
      refresh();
    } finally {
      setSavingNotes(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`¿Eliminar el proyecto "${project!.projectName}"?`)) return;
    setDeleting(true);
    try {
      await deleteProjectApi(project!.id);
      router.push("/admin");
    } catch {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="font-mono text-[10px] uppercase tracking-widest text-[var(--teal)] no-underline hover:text-white"
          >
            ← Todos los proyectos
          </Link>
          <h1 className="mt-2 font-[family-name:var(--font-title)] text-3xl uppercase tracking-tight text-white">
            {project.clientName}
          </h1>
          <p className="text-sm text-white/60">{project.projectName}</p>
        </div>
        <AdminButton variant="danger" onClick={handleDelete} disabled={deleting}>
          {deleting ? "Eliminando..." : "Eliminar proyecto"}
        </AdminButton>
      </div>

      <AdminCard className="p-5">
        <AdminLabel>Estado del proyecto</AdminLabel>
        <div className="mt-4">
          <StatusStepper status={project.status} onChange={handleStatusChange} />
        </div>
      </AdminCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PortalLinkCard token={project.token} />

        <AdminCard className="flex flex-col gap-3 p-5">
          <AdminLabel>Notas internas</AdminLabel>
          <AdminTextarea
            rows={4}
            value={notesValue}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notas visibles solo para el equipo..."
          />
          <AdminButton className="self-start" onClick={handleSaveNotes} disabled={savingNotes}>
            {savingNotes ? "Guardando..." : "Guardar notas"}
          </AdminButton>
        </AdminCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AdminCard className="p-5">
          <AdminLabel>Comentarios con el cliente</AdminLabel>
          <div className="mt-4">
            <CommentThread
              comments={project.comments}
              currentRole="admin"
              currentName="vos"
              onSend={async (body) => {
                await addAdminCommentApi(project!.id, body);
                refresh();
              }}
            />
          </div>
        </AdminCard>

        <AdminCard className="p-5">
          <AdminLabel>Archivos</AdminLabel>
          <div className="mt-4">
            <FileUploadPanel
              files={project.files}
              onUpload={async (file) => {
                await uploadAdminFileApi(project!.id, file);
                refresh();
              }}
              getDownloadUrl={(fileId) => fileDownloadUrl(project!.id, fileId)}
            />
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
