"use client";

import { useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { use } from "react";
import Link from "next/link";
import { useProject } from "@/lib/admin/useProjects";
import {
  addComment,
  addFile,
  deleteProject,
  updateProjectNotes,
  updateProjectStatus,
} from "@/lib/admin/store";
import type { ProjectStatus } from "@/lib/admin/types";
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

export default function AdminProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const project = useProject(id);
  const router = useRouter();
  const [notes, setNotes] = useState<string | null>(null);

  if (!project) {
    notFound();
  }

  const notesValue = notes ?? project.notes;

  function handleStatusChange(status: ProjectStatus) {
    updateProjectStatus(project!.id, status);
  }

  function handleDelete() {
    if (!confirm(`¿Eliminar el proyecto "${project!.projectName}"?`)) return;
    deleteProject(project!.id);
    router.push("/admin");
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
            {project!.clientName}
          </h1>
          <p className="text-sm text-white/60">{project!.projectName}</p>
        </div>
        <AdminButton variant="danger" onClick={handleDelete}>
          Eliminar proyecto
        </AdminButton>
      </div>

      <AdminCard className="p-5">
        <AdminLabel>Estado del proyecto</AdminLabel>
        <div className="mt-4">
          <StatusStepper status={project!.status} onChange={handleStatusChange} />
        </div>
      </AdminCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PortalLinkCard token={project!.token} />

        <AdminCard className="flex flex-col gap-3 p-5">
          <AdminLabel>Notas internas</AdminLabel>
          <AdminTextarea
            rows={4}
            value={notesValue}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notas visibles solo para el equipo..."
          />
          <AdminButton
            className="self-start"
            onClick={() => updateProjectNotes(project!.id, notesValue)}
          >
            Guardar notas
          </AdminButton>
        </AdminCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AdminCard className="p-5">
          <AdminLabel>Comentarios con el cliente</AdminLabel>
          <div className="mt-4">
            <CommentThread
              comments={project!.comments}
              currentRole="admin"
              currentName="Shift Studio"
              onSend={(body) => addComment(project!.id, "admin", "Shift Studio", body)}
            />
          </div>
        </AdminCard>

        <AdminCard className="p-5">
          <AdminLabel>Archivos</AdminLabel>
          <div className="mt-4">
            <FileUploadPanel
              files={project!.files}
              currentRole="admin"
              onUpload={(file) => addFile(project!.id, file)}
            />
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
