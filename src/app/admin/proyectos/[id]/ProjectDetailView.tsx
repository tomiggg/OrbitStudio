"use client";

import { useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { useProject } from "@/lib/admin/useProjects";
import {
  addAdminCommentApi,
  deleteProjectApi,
  fileDownloadUrl,
  markSeenByAdminApi,
  updateNotesApi,
  updateStatusApi,
} from "@/lib/admin/apiClient";
import type { Project, ProjectStatus } from "@/lib/admin/types";
import { StatusStepper } from "@/components/admin/StatusStepper";
import { StatusHistory } from "@/components/admin/StatusHistory";
import { CommentThread } from "@/components/admin/CommentThread";
import { FileUploadPanel } from "@/components/admin/FileUploadPanel";
import { PortalLinkCard } from "@/components/admin/PortalLinkCard";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { FadeIn } from "@/components/admin/FadeIn";
import { useToast } from "@/components/admin/Toaster";
import { jakarta } from "@/components/admin/fonts";
import {
  AdminButton,
  AdminCard,
  AdminLabel,
  AdminSkeleton,
  AdminTextarea,
} from "@/components/admin/ui/AdminPrimitives";

export function ProjectDetailView({
  id,
  initialProject,
}: {
  id: string;
  initialProject: Project;
}) {
  const toast = useToast();
  const { data: project, notFound: isNotFound, refresh } = useProject(id, initialProject);
  const router = useRouter();
  const [notes, setNotes] = useState<string | null>(null);
  const [savingNotes, setSavingNotes] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    markSeenByAdminApi(id).catch(() => {});
  }, [id]);

  if (isNotFound) {
    notFound();
  }

  if (!project) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <AdminSkeleton className="h-3 w-40" />
          <AdminSkeleton className="h-9 w-72" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AdminSkeleton className="h-40 w-full" />
          <AdminSkeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  const notesValue = notes ?? project.notes;

  async function handleStatusChange(status: ProjectStatus) {
    try {
      await updateStatusApi(project!.id, status);
      refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "No se pudo cambiar el estado.", "error");
    }
  }

  async function handleSaveNotes() {
    setSavingNotes(true);
    try {
      await updateNotesApi(project!.id, notesValue);
      refresh();
      toast("Notas guardadas", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "No se pudieron guardar las notas.", "error");
    } finally {
      setSavingNotes(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteProjectApi(project!.id);
      router.push("/admin");
    } catch (e) {
      setDeleting(false);
      setConfirmDelete(false);
      toast(e instanceof Error ? e.message : "No se pudo eliminar el proyecto.", "error");
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <ConfirmDialog
        open={confirmDelete}
        title="Eliminar proyecto"
        description={`Esto borra "${project.projectName}" de forma permanente, junto con sus comentarios y archivos. No se puede deshacer.`}
        confirmLabel="Eliminar"
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />

      <FadeIn>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              href="/admin"
              className="font-mono text-[10px] uppercase tracking-widest text-[var(--sky)] no-underline hover:text-white"
            >
              ← Todos los proyectos
            </Link>
            <h1 className={`mt-2 ${jakarta.className} text-3xl tracking-tight text-white`}>
              {project.clientName}
            </h1>
            <p className="text-sm text-white/60">{project.projectName}</p>
          </div>
          <AdminButton variant="danger" onClick={() => setConfirmDelete(true)}>
            Eliminar proyecto
          </AdminButton>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AdminCard className="p-5">
            <AdminLabel>Estado del proyecto</AdminLabel>
            <div className="mt-4">
              <StatusStepper status={project.status} onChange={handleStatusChange} />
            </div>
          </AdminCard>

          <AdminCard className="p-5">
            <AdminLabel>Historial de estado</AdminLabel>
            <div className="mt-4">
              <StatusHistory history={project.statusHistory} />
            </div>
          </AdminCard>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
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
      </FadeIn>

      <FadeIn delay={0.15}>
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
                uploadUrl={`/api/admin/projects/${project.id}/files`}
                onUploaded={() => {
                  refresh();
                  toast("Archivo subido", "success");
                }}
                getDownloadUrl={(fileId) => fileDownloadUrl(project!.id, fileId)}
              />
            </div>
          </AdminCard>
        </div>
      </FadeIn>
    </div>
  );
}
