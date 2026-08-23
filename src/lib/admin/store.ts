"use client";

import type { Project, ProjectComment, ProjectFile, ProjectStatus, StatusChange } from "./types";

const STORAGE_KEY = "shift-studio-admin-projects-v1";

function nowIso() {
  return new Date().toISOString();
}

function makeId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function seedProjects(): Project[] {
  return [
    {
      id: "proj-1",
      token: "pb-inmobiliaria",
      clientName: "PB Inmobiliaria",
      projectName: "Sitio institucional + panel de turnos",
      status: "desarrollo",
      createdAt: "2026-07-01T12:00:00.000Z",
      updatedAt: "2026-08-10T12:00:00.000Z",
      notes: "Cliente pidió sumar galería de propiedades destacadas.",
      comments: [
        {
          id: makeId(),
          author: "admin",
          authorName: "Shift Studio",
          body: "Arrancamos con el desarrollo del home y el listado de propiedades.",
          createdAt: "2026-08-01T15:00:00.000Z",
        },
        {
          id: makeId(),
          author: "client",
          authorName: "PB Inmobiliaria",
          body: "Buenísimo, ¿podemos sumar un botón de WhatsApp fijo?",
          createdAt: "2026-08-02T09:30:00.000Z",
        },
      ],
      files: [],
      statusHistory: [
        { status: "brief", changedAt: "2026-07-01T12:00:00.000Z" },
        { status: "diseno", changedAt: "2026-07-10T12:00:00.000Z" },
        { status: "desarrollo", changedAt: "2026-08-01T12:00:00.000Z" },
      ],
      // el admin todavía no vio el comentario del cliente del 02/08
      lastSeenByAdmin: "2026-08-02T08:00:00.000Z",
      lastSeenByClient: "2026-08-02T09:30:00.000Z",
    },
    {
      id: "proj-2",
      token: "tu-utn",
      clientName: "TU UTN",
      projectName: "Rediseño plataforma académica",
      status: "revision",
      createdAt: "2026-06-15T12:00:00.000Z",
      updatedAt: "2026-08-15T12:00:00.000Z",
      notes: "Falta feedback final sobre paleta de colores.",
      comments: [
        {
          id: makeId(),
          author: "admin",
          authorName: "Shift Studio",
          body: "Subimos la nueva versión para revisión, quedamos atentos.",
          createdAt: "2026-08-14T18:00:00.000Z",
        },
      ],
      files: [],
      statusHistory: [
        { status: "brief", changedAt: "2026-06-15T12:00:00.000Z" },
        { status: "diseno", changedAt: "2026-07-01T12:00:00.000Z" },
        { status: "desarrollo", changedAt: "2026-07-20T12:00:00.000Z" },
        { status: "revision", changedAt: "2026-08-14T18:00:00.000Z" },
      ],
      lastSeenByAdmin: "2026-08-15T12:00:00.000Z",
      // el cliente todavía no vio que el admin subió la nueva versión
      lastSeenByClient: "2026-08-13T12:00:00.000Z",
    },
    {
      id: "proj-3",
      token: "kioscos-del-sur",
      clientName: "Kioscos del Sur",
      projectName: "Landing + catálogo digital",
      status: "brief",
      createdAt: "2026-08-18T12:00:00.000Z",
      updatedAt: "2026-08-18T12:00:00.000Z",
      notes: "Reunión de kickoff agendada para la próxima semana.",
      comments: [],
      files: [],
      statusHistory: [{ status: "brief", changedAt: "2026-08-18T12:00:00.000Z" }],
      lastSeenByAdmin: "2026-08-18T12:00:00.000Z",
      lastSeenByClient: "2026-08-18T12:00:00.000Z",
    },
  ];
}

// Normaliza proyectos leídos de localStorage: rellena campos agregados en
// sesiones posteriores (statusHistory, lastSeenBy*) para que datos viejos
// guardados en el navegador del usuario no rompan la UI nueva.
function normalizeProject(raw: Project): Project {
  return {
    ...raw,
    statusHistory:
      Array.isArray(raw.statusHistory) && raw.statusHistory.length > 0
        ? raw.statusHistory
        : [{ status: raw.status, changedAt: raw.createdAt }],
    lastSeenByAdmin: raw.lastSeenByAdmin ?? raw.updatedAt ?? raw.createdAt,
    lastSeenByClient: raw.lastSeenByClient ?? raw.createdAt,
  };
}

let cache: Project[] | null = null;
const listeners = new Set<() => void>();

function readFromStorage(): Project[] {
  if (typeof window === "undefined") return seedProjects();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = seedProjects();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw) as Project[];
    return parsed.map(normalizeProject);
  } catch {
    return seedProjects();
  }
}

function ensureCache(): Project[] {
  if (cache === null) {
    cache = readFromStorage();
  }
  return cache;
}

function persist(next: Project[]) {
  cache = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  listeners.forEach((fn) => fn());
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) {
      cache = null;
      listeners.forEach((fn) => fn());
    }
  });
}

export function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function getSnapshot(): Project[] {
  return ensureCache();
}

export function getServerSnapshot(): Project[] {
  return seedProjects();
}

export function getProjectById(id: string): Project | undefined {
  return ensureCache().find((p) => p.id === id);
}

export function getProjectByToken(token: string): Project | undefined {
  return ensureCache().find((p) => p.token === token);
}

export function createProject(input: {
  clientName: string;
  projectName: string;
  token: string;
}): Project {
  const createdAt = nowIso();
  const project: Project = {
    id: makeId(),
    token: input.token,
    clientName: input.clientName,
    projectName: input.projectName,
    status: "brief",
    createdAt,
    updatedAt: createdAt,
    notes: "",
    comments: [],
    files: [],
    statusHistory: [{ status: "brief", changedAt: createdAt }],
    lastSeenByAdmin: createdAt,
    lastSeenByClient: createdAt,
  };
  persist([project, ...ensureCache()]);
  return project;
}

export function updateProjectStatus(id: string, status: ProjectStatus) {
  const changedAt = nowIso();
  persist(
    ensureCache().map((p) => {
      if (p.id !== id || p.status === status) return p;
      const entry: StatusChange = { status, changedAt };
      return {
        ...p,
        status,
        updatedAt: changedAt,
        statusHistory: [...p.statusHistory, entry],
      };
    })
  );
}

export function markSeenByAdmin(id: string) {
  const seenAt = nowIso();
  persist(
    ensureCache().map((p) => (p.id === id ? { ...p, lastSeenByAdmin: seenAt } : p))
  );
}

export function markSeenByClient(id: string) {
  const seenAt = nowIso();
  persist(
    ensureCache().map((p) => (p.id === id ? { ...p, lastSeenByClient: seenAt } : p))
  );
}

export function updateProjectNotes(id: string, notes: string) {
  persist(
    ensureCache().map((p) => (p.id === id ? { ...p, notes, updatedAt: nowIso() } : p))
  );
}

export function addComment(
  id: string,
  author: ProjectComment["author"],
  authorName: string,
  body: string
) {
  const comment: ProjectComment = {
    id: makeId(),
    author,
    authorName,
    body,
    createdAt: nowIso(),
  };
  persist(
    ensureCache().map((p) =>
      p.id === id
        ? { ...p, comments: [...p.comments, comment], updatedAt: nowIso() }
        : p
    )
  );
  return comment;
}

export function addFile(
  id: string,
  file: Omit<ProjectFile, "id" | "uploadedAt">
) {
  const entry: ProjectFile = {
    ...file,
    id: makeId(),
    uploadedAt: nowIso(),
  };
  persist(
    ensureCache().map((p) =>
      p.id === id ? { ...p, files: [...p.files, entry], updatedAt: nowIso() } : p
    )
  );
  return entry;
}

export function deleteProject(id: string) {
  persist(ensureCache().filter((p) => p.id !== id));
}

// Actividad del cliente (comentarios o archivos) más reciente que la última
// vez que el admin abrió el proyecto.
export function hasUnreadForAdmin(project: Project): boolean {
  const clientTimestamps = [
    ...project.comments.filter((c) => c.author === "client").map((c) => c.createdAt),
    ...project.files.filter((f) => f.uploadedBy === "client").map((f) => f.uploadedAt),
  ];
  return clientTimestamps.some((t) => t > project.lastSeenByAdmin);
}

// Actividad del admin (comentarios, archivos o cambios de estado) más
// reciente que la última vez que el cliente abrió su portal.
export function hasUnreadForClient(project: Project): boolean {
  const adminTimestamps = [
    ...project.comments.filter((c) => c.author === "admin").map((c) => c.createdAt),
    ...project.files.filter((f) => f.uploadedBy === "admin").map((f) => f.uploadedAt),
    ...project.statusHistory.map((s) => s.changedAt),
  ];
  return adminTimestamps.some((t) => t > project.lastSeenByClient);
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
