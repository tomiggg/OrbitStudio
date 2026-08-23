"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useProjects } from "@/hooks/useAdminStore";
import { STAGE_META } from "@/lib/admin/stages";
import { StatusBadge } from "./StatusBadge";
import { formatDate } from "@/lib/admin/format";
import type { ProjectStatus } from "@/lib/admin/types";

const FILTERS: { key: ProjectStatus | "todos"; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "activo", label: "Activos" },
  { key: "pausado", label: "Pausados" },
  { key: "completado", label: "Completados" },
];

export function ProjectsTable() {
  const projects = useProjects();
  const [filter, setFilter] = useState<ProjectStatus | "todos">("todos");

  const filtered = useMemo(() => {
    const list = filter === "todos" ? projects : projects.filter((p) => p.status === filter);
    return [...list].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  }, [projects, filter]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-title text-3xl uppercase tracking-[-0.02em]">Proyectos</h1>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-[color:rgba(250,252,252,0.45)]">
            {projects.length} proyecto{projects.length === 1 ? "" : "s"} en el sistema
          </p>
        </div>
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] ${
                filter === f.key
                  ? "border-[color:var(--teal)] text-[color:var(--teal)]"
                  : "border-[color:rgba(250,252,252,0.2)] text-[color:rgba(250,252,252,0.5)] hover:border-[color:rgba(250,252,252,0.4)]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="border border-[color:rgba(250,252,252,0.15)] px-6 py-16 text-center">
          <p className="font-mono text-[11px] uppercase tracking-wide text-[color:rgba(250,252,252,0.45)]">
            No hay proyectos en este filtro.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project) => (
            <Link
              key={project.id}
              href={`/admin/proyectos/${project.id}`}
              className="group flex flex-col gap-4 border border-[color:rgba(250,252,252,0.15)] p-5 no-underline transition-colors hover:border-[color:var(--teal)] hover:no-underline"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-title text-lg uppercase leading-tight tracking-[-0.01em] text-[color:var(--white)]">
                    {project.clientCompany || project.clientName}
                  </p>
                  <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-wide text-[color:rgba(250,252,252,0.45)]">
                    {project.title}
                  </p>
                </div>
                <StatusBadge status={project.status} />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.15em] text-[color:rgba(250,252,252,0.5)]">
                  <span>{STAGE_META[project.stage].label}</span>
                  <span>{project.progressPct}%</span>
                </div>
                <div className="h-1 w-full bg-[color:rgba(250,252,252,0.12)]">
                  <div className="h-1 bg-[color:var(--teal)]" style={{ width: `${project.progressPct}%` }} />
                </div>
              </div>

              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wide text-[color:rgba(250,252,252,0.4)]">
                <span>Actualizado {formatDate(project.updatedAt)}</span>
                <span className="text-[color:var(--teal)] opacity-0 transition-opacity group-hover:opacity-100">
                  Ver →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
