"use client";

import { useState } from "react";
import Link from "next/link";
import { useProjects } from "@/lib/admin/useProjects";
import { createProject, slugify } from "@/lib/admin/store";
import { PROJECT_STATUS_LABEL, type ProjectStatus } from "@/lib/admin/types";
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

export default function AdminDashboardPage() {
  const projects = useProjects();
  const [filter, setFilter] = useState<ProjectStatus | "todos">("todos");
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  const filtered = projects
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

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-title)] text-3xl uppercase tracking-tight text-white">
            Proyectos
          </h1>
          <p className="font-mono text-xs text-white/50">
            {projects.length} proyecto{projects.length === 1 ? "" : "s"} en total
          </p>
        </div>
        <AdminButton onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Cancelar" : "+ Nuevo proyecto"}
        </AdminButton>
      </div>

      {showForm && (
        <NewProjectForm onDone={() => setShowForm(false)} />
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
        {filtered.map((project) => (
          <Link
            key={project.id}
            href={`/admin/proyectos/${project.id}`}
            className="no-underline"
          >
            <AdminCard className="flex h-full flex-col gap-3 p-4 transition hover:border-[var(--teal)]">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-[family-name:var(--font-title)] text-lg uppercase tracking-tight text-white">
                    {project.clientName}
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
        {filtered.length === 0 && (
          <p className="font-mono text-sm text-white/40">
            No hay proyectos que coincidan con el filtro.
          </p>
        )}
      </div>
    </div>
  );
}

function NewProjectForm({ onDone }: { onDone: () => void }) {
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");

  function handleSubmit() {
    if (!clientName.trim() || !projectName.trim()) return;
    createProject({
      clientName: clientName.trim(),
      projectName: projectName.trim(),
      token: `${slugify(clientName)}-${Math.random().toString(36).slice(2, 6)}`,
    });
    onDone();
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
      <AdminButton
        className="self-start"
        onClick={handleSubmit}
        disabled={!clientName.trim() || !projectName.trim()}
      >
        Crear proyecto
      </AdminButton>
    </AdminCard>
  );
}
