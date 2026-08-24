"use client";

import { useState } from "react";
import Link from "next/link";
import { useProjects } from "@/lib/admin/useProjects";
import { createProjectApi } from "@/lib/admin/apiClient";
import { hasUnreadForAdmin } from "@/lib/admin/activity";
import { PROJECT_STATUS_LABEL, type Project, type ProjectStatus } from "@/lib/admin/types";
import {
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminInput,
  AdminLabel,
} from "@/components/admin/ui/AdminPrimitives";

const STATUS_FILTERS: Array<ProjectStatus | "todos"> = [
  "todos",
  "brief",
  "diseno",
  "desarrollo",
  "revision",
  "entregado",
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function DashboardView({ initialProjects }: { initialProjects: Project[] }) {
  const { data: projects, loading, error, refresh } = useProjects(initialProjects);
  const [filter, setFilter] = useState<ProjectStatus | "todos">("todos");
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  const filtered = (projects ?? [])
    .filter((p) => (filter === "todos" ? true : p.status === filter))
    .filter((p) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        p.clientName.toLowerCase().includes(q) ||
        p.projectName.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));

  const unreadCount = (projects ?? []).filter(hasUnreadForAdmin).length;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-title)] text-3xl uppercase tracking-tight text-white">
            Proyectos
          </h1>
          <p className="font-mono text-xs text-white/50">
            {projects
              ? `${projects.length} proyecto${projects.length === 1 ? "" : "s"} en total${
                  unreadCount > 0
                    ? ` · ${unreadCount} con actividad nueva del cliente`
                    : ""
                }`
              : "Cargando..."}
          </p>
        </div>
        <AdminButton onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Cancelar" : "+ Nuevo proyecto"}
        </AdminButton>
      </div>

      {error && (
        <p className="font-mono text-xs text-red-400">
          No se pudieron cargar los proyectos: {error}
        </p>
      )}

      {showForm && (
        <NewProjectForm
          onDone={() => setShowForm(false)}
          onCreated={refresh}
        />
      )}

      <div className="flex flex-wrap items-center gap-4">
        <AdminInput
          placeholder="Buscar cliente o proyecto..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition ${
                filter === f
                  ? "border-[var(--teal)] bg-[var(--teal)] text-[var(--dark)]"
                  : "border-[var(--teal)]/30 text-[var(--teal)] hover:bg-[var(--teal)]/10"
              }`}
            >
              {f === "todos" ? "Todos" : PROJECT_STATUS_LABEL[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading && !projects && (
          <p className="font-mono text-sm text-white/40">Cargando proyectos...</p>
        )}
        {filtered.map((project) => (
          <Link
            key={project.id}
            href={`/admin/proyectos/${project.id}`}
            className="no-underline"
          >
            <AdminCard className="flex h-full flex-col gap-3 p-4 transition hover:border-[var(--teal)]">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 truncate font-[family-name:var(--font-title)] text-lg uppercase tracking-tight text-white">
                    {hasUnreadForAdmin(project) && (
                      <span
                        className="h-2 w-2 shrink-0 bg-[var(--teal)]"
                        title="Actividad nueva del cliente"
                      />
                    )}
                    <span className="truncate">{project.clientName}</span>
                  </p>
                  <p className="truncate text-sm text-white/60">
                    {project.projectName}
                  </p>
                </div>
                <AdminBadge>{PROJECT_STATUS_LABEL[project.status]}</AdminBadge>
              </div>
              <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-3">
                <AdminLabel>{project.comments.length} comentarios</AdminLabel>
                <span className="font-mono text-[10px] text-white/40">
                  Act. {formatDate(project.updatedAt)}
                </span>
              </div>
            </AdminCard>
          </Link>
        ))}
        {!loading && projects && filtered.length === 0 && (
          <p className="font-mono text-sm text-white/40">
            No hay proyectos que coincidan con el filtro.
          </p>
        )}
      </div>
    </div>
  );
}

function NewProjectForm({
  onDone,
  onCreated,
}: {
  onDone: () => void;
  onCreated: () => void;
}) {
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!clientName.trim() || !projectName.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await createProjectApi({
        clientName: clientName.trim(),
        projectName: projectName.trim(),
      });
      onCreated();
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo crear el proyecto.");
      setSubmitting(false);
    }
  }

  return (
    <AdminCard className="flex flex-col gap-4 p-5">
      <AdminLabel>Nuevo proyecto</AdminLabel>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[10px] uppercase tracking-widest text-white/50">
            Cliente
          </label>
          <AdminInput
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Ej: PB Inmobiliaria"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[10px] uppercase tracking-widest text-white/50">
            Proyecto
          </label>
          <AdminInput
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Ej: Sitio institucional"
          />
        </div>
      </div>
      {error && <p className="font-mono text-[10px] text-red-400">{error}</p>}
      <AdminButton
        className="self-start"
        onClick={handleSubmit}
        disabled={submitting || !clientName.trim() || !projectName.trim()}
      >
        {submitting ? "Creando..." : "Crear proyecto"}
      </AdminButton>
    </AdminCard>
  );
}
