import { randomUUID } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type {
  AuthorRole,
  Project,
  ProjectComment,
  ProjectFile,
  ProjectStatus,
} from "./types";
import type { NewFileInput, NewProjectInput, ProjectsRepository } from "./repository";
import { slugify } from "./repository";

// Implementación "mock real": persiste en disco (data/projects.json +
// data/uploads/**) en vez de localStorage del navegador. Funciona de verdad
// en dev y en un hosting con filesystem persistente (self-host/VPS/contenedor
// con volumen). NO persiste en hosting serverless sin volumen (ej. Vercel
// default) — ahí hay que swapear esta implementación por una real (ver
// PROGRESS.md). El contrato (ProjectsRepository) es lo que hay que respetar.

const DATA_DIR = path.join(process.cwd(), "data");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

function nowIso() {
  return new Date().toISOString();
}

function makeId() {
  return randomUUID();
}

function seedProjects(): Project[] {
  return [
    {
      id: "proj-1",
      token: "pb-inmobiliaria",
      clientName: "PB Inmobiliaria",
      projectName: "Sitio institucional + panel de turnos",
      status: "desarrollo",
      statusHistory: [{ status: "desarrollo", changedAt: "2026-08-10T12:00:00.000Z" }],
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
      lastSeenByAdmin: "2026-08-01T15:00:00.000Z",
      lastSeenByClient: "2026-08-02T09:30:00.000Z",
    },
    {
      id: "proj-2",
      token: "tu-utn",
      clientName: "TU UTN",
      projectName: "Rediseño plataforma académica",
      status: "revision",
      statusHistory: [{ status: "revision", changedAt: "2026-08-15T12:00:00.000Z" }],
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
      lastSeenByAdmin: "2026-08-14T18:00:00.000Z",
      lastSeenByClient: null,
    },
    {
      id: "proj-3",
      token: "kioscos-del-sur",
      clientName: "Kioscos del Sur",
      projectName: "Landing + catálogo digital",
      status: "brief",
      statusHistory: [{ status: "brief", changedAt: "2026-08-18T12:00:00.000Z" }],
      createdAt: "2026-08-18T12:00:00.000Z",
      updatedAt: "2026-08-18T12:00:00.000Z",
      notes: "Reunión de kickoff agendada para la próxima semana.",
      comments: [],
      files: [],
      lastSeenByAdmin: null,
      lastSeenByClient: null,
    },
  ];
}

// Serializa todas las escrituras para evitar carreras entre requests
// concurrentes que caigan en la misma instancia de módulo (ver nota en
// ensureCache/persist sobre por qué no hay más caché en memoria).
let writeChain: Promise<unknown> = Promise.resolve();
function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  const result = writeChain.then(fn, fn);
  writeChain = result.then(
    () => undefined,
    () => undefined
  );
  return result;
}

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
  await mkdir(UPLOADS_DIR, { recursive: true });
}

async function readFromDisk(): Promise<Project[]> {
  try {
    const raw = await readFile(PROJECTS_FILE, "utf8");
    return JSON.parse(raw) as Project[];
  } catch {
    await ensureDataDir();
    const seeded = seedProjects();
    await writeFile(PROJECTS_FILE, JSON.stringify(seeded, null, 2), "utf8");
    return seeded;
  }
}

// Next (sobre todo con Turbopack) puede compilar cada route handler / page en
// un chunk con su propio registro de módulos, así que un caché en memoria acá
// no está garantizado a ser visible entre request de distintas rutas — se
// leyó un caso real donde crear un proyecto desde /api/admin/projects no se
// veía todavía en /portal/[token] (otro módulo, otra instancia de este
// archivo). Por eso cada operación relee el archivo: data/projects.json es
// la única fuente de verdad, el JSON es chico y esto es una herramienta de
// bajo tráfico — el costo de no cachear es despreciable.
async function ensureCache(): Promise<Project[]> {
  return readFromDisk();
}

async function persist(next: Project[]): Promise<void> {
  await ensureDataDir();
  await writeFile(PROJECTS_FILE, JSON.stringify(next, null, 2), "utf8");
}

function sanitizeFileName(name: string): string {
  const base = name.replace(/[/\\]/g, "_").replace(/[^\w.\- ]/g, "_").trim();
  return base.slice(0, 150) || "archivo";
}

function uniqueToken(existing: Project[], clientName: string): string {
  const base = slugify(clientName) || "cliente";
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = `${base}-${randomUUID().slice(0, 6)}`;
    if (!existing.some((p) => p.token === candidate)) return candidate;
  }
  return `${base}-${randomUUID()}`;
}

async function findProject(id: string): Promise<Project | undefined> {
  const projects = await ensureCache();
  return projects.find((p) => p.id === id);
}

async function mutateProject(
  id: string,
  fn: (project: Project) => Project
): Promise<Project | undefined> {
  return enqueue(async () => {
    const projects = await ensureCache();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) return undefined;
    const updated = fn(projects[index]);
    const next = [...projects];
    next[index] = updated;
    await persist(next);
    return updated;
  });
}

export const fileStoreRepository: ProjectsRepository = {
  async list() {
    return ensureCache();
  },

  async getById(id) {
    return findProject(id);
  },

  async getByToken(token) {
    const projects = await ensureCache();
    return projects.find((p) => p.token === token);
  },

  async create(input: NewProjectInput) {
    return enqueue(async () => {
      const projects = await ensureCache();
      const clientName = input.clientName.trim().slice(0, 120);
      const projectName = input.projectName.trim().slice(0, 160);
      const ts = nowIso();
      const project: Project = {
        id: makeId(),
        token: uniqueToken(projects, clientName),
        clientName,
        projectName,
        status: "brief",
        statusHistory: [{ status: "brief", changedAt: ts }],
        createdAt: ts,
        updatedAt: ts,
        notes: "",
        comments: [],
        files: [],
        lastSeenByAdmin: ts,
        lastSeenByClient: null,
      };
      await persist([project, ...projects]);
      return project;
    });
  },

  async updateStatus(id: string, status: ProjectStatus) {
    return mutateProject(id, (p) => {
      if (p.status === status) return { ...p, updatedAt: nowIso() };
      return {
        ...p,
        status,
        statusHistory: [...p.statusHistory, { status, changedAt: nowIso() }],
        updatedAt: nowIso(),
      };
    });
  },

  async updateNotes(id: string, notes: string) {
    return mutateProject(id, (p) => ({
      ...p,
      notes: notes.slice(0, 4000),
      updatedAt: nowIso(),
    }));
  },

  async addComment(id: string, author: AuthorRole, authorName: string, body: string) {
    const trimmed = body.trim().slice(0, 4000);
    if (!trimmed) return undefined;
    const comment: ProjectComment = {
      id: makeId(),
      author,
      authorName,
      body: trimmed,
      createdAt: nowIso(),
    };
    const updated = await mutateProject(id, (p) => ({
      ...p,
      comments: [...p.comments, comment],
      updatedAt: nowIso(),
    }));
    return updated ? comment : undefined;
  },

  async addFile(id: string, input: NewFileInput) {
    if (input.size > MAX_FILE_SIZE) {
      throw new Error("El archivo supera el límite de 20MB.");
    }
    const fileId = makeId();
    const storedName = `${fileId}__${sanitizeFileName(input.name)}`;
    await ensureDataDir();
    const projectDir = path.join(UPLOADS_DIR, id);
    await mkdir(projectDir, { recursive: true });
    await writeFile(path.join(projectDir, storedName), input.buffer);

    const entry: ProjectFile = {
      id: fileId,
      name: input.name.slice(0, 200),
      size: input.size,
      mimeType: input.mimeType || "application/octet-stream",
      uploadedBy: input.uploadedBy,
      uploadedAt: nowIso(),
      storedName,
    };
    const updated = await mutateProject(id, (p) => ({
      ...p,
      files: [...p.files, entry],
      updatedAt: nowIso(),
    }));
    return updated ? entry : undefined;
  },

  async getFileBuffer(projectId, fileId) {
    const project = await findProject(projectId);
    if (!project) return undefined;
    const file = project.files.find((f) => f.id === fileId);
    if (!file) return undefined;
    try {
      const buffer = await readFile(path.join(UPLOADS_DIR, projectId, file.storedName));
      return { buffer, file };
    } catch {
      return undefined;
    }
  },

  async deleteProject(id: string) {
    return enqueue(async () => {
      const projects = await ensureCache();
      if (!projects.some((p) => p.id === id)) return false;
      await persist(projects.filter((p) => p.id !== id));
      await rm(path.join(UPLOADS_DIR, id), { recursive: true, force: true }).catch(() => {});
      return true;
    });
  },

  async markSeenByAdmin(id: string) {
    await mutateProject(id, (p) => ({ ...p, lastSeenByAdmin: nowIso() }));
  },

  async markSeenByClient(id: string) {
    await mutateProject(id, (p) => ({ ...p, lastSeenByClient: nowIso() }));
  },
};
