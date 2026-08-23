"use client";

import type { AttachmentMeta, ClientProject, CommentEntry, NewProjectInput, ProjectStage } from "./types";
import { SEED_PROJECTS } from "./mock-data";
import { STAGE_META } from "./stages";

// Mock "backend": persistido en localStorage del navegador.
// Sincroniza entre pestañas del mismo navegador vía el evento `storage`.
// TODO(backend): reemplazar por una API real (DB + auth) — este store es
// intencionalmente client-only para poder avanzar sin bloquear el desarrollo.

const STORAGE_KEY = "shiftstudio.admin.projects.v1";
const CHANGE_EVENT = "shiftstudio-admin-store-change";

// Cache en memoria: readAll() debe devolver la MISMA referencia mientras los
// datos no cambien (requisito de useSyncExternalStore para no re-renderizar
// en loop). Se invalida en cada escritura propia y en cambios de otra pestaña.
let cache: ClientProject[] | null = null;

function isBrowser() {
  return typeof window !== "undefined";
}

function readAll(): ClientProject[] {
  if (cache) return cache;
  if (!isBrowser()) return SEED_PROJECTS;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    cache = SEED_PROJECTS;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    return cache;
  }
  try {
    const parsed = JSON.parse(raw) as ClientProject[];
    if (!Array.isArray(parsed)) throw new Error("shape");
    cache = parsed;
    return cache;
  } catch {
    cache = SEED_PROJECTS;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    return cache;
  }
}

function writeAll(projects: ClientProject[]) {
  cache = projects;
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 40) || "proyecto"
  );
}

function randomAccessCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function subscribe(callback: () => void): () => void {
  if (!isBrowser()) return () => {};
  const onCustomChange = () => callback();
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      cache = null;
      callback();
    }
  };
  window.addEventListener(CHANGE_EVENT, onCustomChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onCustomChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function getProjectsSnapshot(): ClientProject[] {
  return readAll();
}

export function getProject(id: string): ClientProject | undefined {
  return readAll().find((p) => p.id === id);
}

export function createProject(input: NewProjectInput): ClientProject {
  const projects = readAll();
  const base = slugify(input.clientCompany || input.clientName || input.title);
  let id = base;
  let n = 2;
  while (projects.some((p) => p.id === id)) {
    id = `${base}-${n}`;
    n += 1;
  }
  const now = new Date().toISOString();
  const project: ClientProject = {
    id,
    clientName: input.clientName,
    clientCompany: input.clientCompany,
    clientEmail: input.clientEmail,
    clientPhone: input.clientPhone,
    title: input.title,
    summary: input.summary,
    status: "activo",
    stage: "briefing",
    stageHistory: [{ stage: "briefing", enteredAt: now }],
    progressPct: STAGE_META.briefing.progressPct,
    startedAt: now,
    dueAt: input.dueAt,
    budgetLabel: input.budgetLabel,
    accessCode: randomAccessCode(),
    comments: [],
    attachments: [],
    createdAt: now,
    updatedAt: now,
  };
  writeAll([project, ...projects]);
  return project;
}

function replaceProject(id: string, updater: (project: ClientProject) => ClientProject): ClientProject | undefined {
  const projects = readAll();
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  const updated = updater(projects[idx]);
  const next = projects.slice();
  next[idx] = updated;
  writeAll(next);
  return updated;
}

export function updateProject(id: string, patch: Partial<ClientProject>) {
  replaceProject(id, (project) => ({
    ...project,
    ...patch,
    updatedAt: new Date().toISOString(),
  }));
}

export function setProjectStage(id: string, stage: ProjectStage, note?: string) {
  replaceProject(id, (project) => {
    const now = new Date().toISOString();
    const alreadyVisited = project.stageHistory.some((h) => h.stage === stage);
    return {
      ...project,
      stage,
      progressPct: STAGE_META[stage].progressPct,
      status: stage === "entregado" ? "completado" : project.status,
      stageHistory: alreadyVisited
        ? project.stageHistory
        : [...project.stageHistory, { stage, enteredAt: now, note }],
      updatedAt: now,
    };
  });
}

export function setProjectStatus(id: string, status: ClientProject["status"]) {
  updateProject(id, { status });
}

export function addComment(
  id: string,
  entry: {
    author: "admin" | "client";
    authorName: string;
    body: string;
    attachments?: Array<Omit<AttachmentMeta, "id" | "uploadedAt">>;
  }
): CommentEntry | undefined {
  const createdAt = new Date().toISOString();
  const attachments: AttachmentMeta[] = (entry.attachments ?? []).map((a) => ({
    ...a,
    id: makeId("att"),
    uploadedAt: createdAt,
  }));
  const comment: CommentEntry = {
    id: makeId("cm"),
    author: entry.author,
    authorName: entry.authorName,
    body: entry.body,
    createdAt,
    attachments,
  };
  const result = replaceProject(id, (project) => ({
    ...project,
    comments: [...project.comments, comment],
    updatedAt: createdAt,
  }));
  return result ? comment : undefined;
}

export function addAttachment(
  id: string,
  attachment: Omit<AttachmentMeta, "id" | "uploadedAt">
): AttachmentMeta | undefined {
  const uploadedAt = new Date().toISOString();
  const full: AttachmentMeta = { ...attachment, id: makeId("att"), uploadedAt };
  const result = replaceProject(id, (project) => ({
    ...project,
    attachments: [full, ...project.attachments],
    updatedAt: uploadedAt,
  }));
  return result ? full : undefined;
}

export function deleteProject(id: string) {
  writeAll(readAll().filter((p) => p.id !== id));
}

export function verifyAccessCode(id: string, code: string): boolean {
  const project = getProject(id);
  if (!project) return false;
  return project.accessCode.trim().toUpperCase() === code.trim().toUpperCase();
}
