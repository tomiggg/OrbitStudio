"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useProject } from "@/hooks/useAdminStore";
import { addAttachment, addComment, deleteProject, setProjectStage, setProjectStatus } from "@/lib/admin/store";
import { STATUS_META } from "@/lib/admin/stages";
import { prepareAttachment } from "@/lib/admin/files";
import { formatDate } from "@/lib/admin/format";
import type { ProjectStatus } from "@/lib/admin/types";
import { StageStepper } from "./StageStepper";
import { StatusBadge } from "./StatusBadge";
import { CommentThread } from "./CommentThread";
import { AttachmentList } from "./AttachmentList";
import { QRPanel } from "./QRPanel";

const STATUS_OPTIONS: ProjectStatus[] = ["activo", "pausado", "completado"];

export function ProjectDetailAdmin({ id }: { id: string }) {
  const project = useProject(id);
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  if (!project) {
    return (
      <div className="border border-[color:rgba(250,252,252,0.15)] px-6 py-16 text-center">
        <p className="font-mono text-[11px] uppercase tracking-wide text-[color:rgba(250,252,252,0.45)]">
          Este proyecto no existe o fue eliminado.
        </p>
        <Link
          href="/admin"
          className="mt-4 inline-block font-mono text-[11px] uppercase tracking-[0.15em] text-[color:var(--teal)] no-underline"
        >
          ← Volver a proyectos
        </Link>
      </div>
    );
  }

  async function handleAdminComment(body: string, files: File[]) {
    const attachments = await Promise.all(
      files.map(async (file) => {
        const prepared = await prepareAttachment(file);
        return { ...prepared, uploadedBy: "admin" as const };
      })
    );
    addComment(id, { author: "admin", authorName: "Shift Studio", body, attachments });
  }

  async function handleFileUpload(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(fileList)) {
        const prepared = await prepareAttachment(file);
        addAttachment(id, { ...prepared, uploadedBy: "admin" });
      }
    } finally {
      setUploading(false);
    }
  }

  function handleDelete() {
    if (!window.confirm(`¿Eliminar el proyecto "${project?.title}"? Esta acción no se puede deshacer.`)) return;
    deleteProject(id);
    router.push("/admin");
  }

  return (
    <div>
      <Link
        href="/admin"
        className="mb-6 inline-block font-mono text-[11px] uppercase tracking-[0.15em] text-[color:rgba(250,252,252,0.5)] no-underline hover:text-[color:var(--teal)]"
      >
        ← Proyectos
      </Link>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--teal)]">
            {project.clientCompany || project.clientName}
          </p>
          <h1 className="mt-1 font-title text-3xl uppercase tracking-[-0.02em] sm:text-4xl">{project.title}</h1>
          {project.summary ? (
            <p className="mt-2 max-w-[560px] text-sm leading-relaxed text-[color:rgba(250,252,252,0.65)]">
              {project.summary}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={project.status} />
          <button
            type="button"
            onClick={handleDelete}
            className="font-mono text-[10px] uppercase tracking-wide text-[color:rgba(250,252,252,0.35)] hover:text-red-400"
          >
            Eliminar proyecto
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1.4fr]">
        <div className="flex flex-col gap-6">
          <section>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.15em] text-[color:rgba(250,252,252,0.5)]">
              Etapa del proyecto
            </p>
            <StageStepper
              stage={project.stage}
              history={project.stageHistory}
              onSelectStage={(stage) => setProjectStage(id, stage)}
            />
          </section>

          <section>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.15em] text-[color:rgba(250,252,252,0.5)]">
              Estado
            </p>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setProjectStatus(id, s)}
                  className={`flex-1 border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.15em] ${
                    project.status === s
                      ? "border-[color:var(--teal)] text-[color:var(--teal)]"
                      : "border-[color:rgba(250,252,252,0.2)] text-[color:rgba(250,252,252,0.5)] hover:border-[color:rgba(250,252,252,0.4)]"
                  }`}
                >
                  {STATUS_META[s].label}
                </button>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-2 gap-3 border border-[color:rgba(250,252,252,0.12)] p-4 font-mono text-[11px]">
            <div>
              <p className="uppercase tracking-wide text-[color:rgba(250,252,252,0.4)]">Cliente</p>
              <p className="mt-0.5 text-[color:var(--white)]">{project.clientName}</p>
            </div>
            <div>
              <p className="uppercase tracking-wide text-[color:rgba(250,252,252,0.4)]">Inicio</p>
              <p className="mt-0.5 text-[color:var(--white)]">{formatDate(project.startedAt)}</p>
            </div>
            <div>
              <p className="uppercase tracking-wide text-[color:rgba(250,252,252,0.4)]">Email</p>
              <p className="mt-0.5 truncate text-[color:var(--white)]">{project.clientEmail || "—"}</p>
            </div>
            <div>
              <p className="uppercase tracking-wide text-[color:rgba(250,252,252,0.4)]">Entrega estimada</p>
              <p className="mt-0.5 text-[color:var(--white)]">{project.dueAt ? formatDate(project.dueAt) : "—"}</p>
            </div>
            <div>
              <p className="uppercase tracking-wide text-[color:rgba(250,252,252,0.4)]">Teléfono</p>
              <p className="mt-0.5 text-[color:var(--white)]">{project.clientPhone || "—"}</p>
            </div>
            <div>
              <p className="uppercase tracking-wide text-[color:rgba(250,252,252,0.4)]">Presupuesto</p>
              <p className="mt-0.5 text-[color:var(--white)]">{project.budgetLabel || "—"}</p>
            </div>
          </section>

          <QRPanel projectId={project.id} accessCode={project.accessCode} />

          <section>
            <div className="mb-3 flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[color:rgba(250,252,252,0.5)]">
                Archivos del proyecto
              </p>
              <label className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.15em] text-[color:var(--teal)]">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
                {uploading ? "Subiendo…" : "+ Subir"}
              </label>
            </div>
            <AttachmentList attachments={project.attachments} />
          </section>
        </div>

        <section>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.15em] text-[color:rgba(250,252,252,0.5)]">
            Comunicación con el cliente
          </p>
          <div className="border border-[color:rgba(250,252,252,0.12)] p-4">
            <CommentThread comments={project.comments} currentAuthor="admin" onSubmit={handleAdminComment} />
          </div>
        </section>
      </div>
    </div>
  );
}
