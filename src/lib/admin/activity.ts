import type { Project, PublicProject } from "./types";

type ActivityProject = Pick<Project | PublicProject, "comments" | "files" | "statusHistory">;

function latestTimestamp(timestamps: string[]): string | null {
  if (timestamps.length === 0) return null;
  return timestamps.sort().at(-1)!;
}

// Última actividad del cliente que el admin todavía no vio: comentarios y
// archivos subidos por el cliente.
function latestAdminFacingActivity(project: ActivityProject): string | null {
  const timestamps: string[] = [];
  for (const c of project.comments) if (c.author === "client") timestamps.push(c.createdAt);
  for (const f of project.files) if (f.uploadedBy === "client") timestamps.push(f.uploadedAt);
  return latestTimestamp(timestamps);
}

// Última actividad del admin que el cliente todavía no vio: comentarios,
// archivos, y cambios de estado — pero no el estado inicial de creación
// (eso no es "una novedad", es que el proyecto recién existe).
function latestClientFacingActivity(project: ActivityProject): string | null {
  const timestamps: string[] = [];
  for (const c of project.comments) if (c.author === "admin") timestamps.push(c.createdAt);
  for (const f of project.files) if (f.uploadedBy === "admin") timestamps.push(f.uploadedAt);
  for (const s of project.statusHistory.slice(1)) timestamps.push(s.changedAt);
  return latestTimestamp(timestamps);
}

export function hasUnreadForAdmin(project: Project): boolean {
  const latest = latestAdminFacingActivity(project);
  if (!latest) return false;
  if (!project.lastSeenByAdmin) return true;
  return latest > project.lastSeenByAdmin;
}

export function hasUnreadForClient(project: ActivityProject & { lastSeenByClient: string | null }): boolean {
  const latest = latestClientFacingActivity(project);
  if (!latest) return false;
  if (!project.lastSeenByClient) return true;
  return latest > project.lastSeenByClient;
}
