import type { ProjectStage } from "./types";

export const STAGE_ORDER: ProjectStage[] = [
  "briefing",
  "diseno",
  "desarrollo",
  "revision",
  "entregado",
];

export const STAGE_META: Record<ProjectStage, { code: string; label: string; progressPct: number }> = {
  briefing: { code: "01", label: "Briefing", progressPct: 10 },
  diseno: { code: "02", label: "Diseño", progressPct: 35 },
  desarrollo: { code: "03", label: "Desarrollo", progressPct: 65 },
  revision: { code: "04", label: "Revisión", progressPct: 88 },
  entregado: { code: "05", label: "Entregado", progressPct: 100 },
};

export const STATUS_META: Record<string, { label: string; tone: "teal" | "muted" | "done" }> = {
  activo: { label: "Activo", tone: "teal" },
  pausado: { label: "Pausado", tone: "muted" },
  completado: { label: "Completado", tone: "done" },
};

export function stageIndex(stage: ProjectStage): number {
  return STAGE_ORDER.indexOf(stage);
}
