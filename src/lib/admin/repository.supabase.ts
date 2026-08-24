import { randomUUID } from "node:crypto";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";
import type {
  AuthorRole,
  Project,
  ProjectComment,
  ProjectFile,
  ProjectStatus,
} from "./types";
import type { NewFileInput, NewProjectInput, ProjectsRepository } from "./repository";
import { slugify } from "./repository";

// Implementación real sobre Supabase (Postgres + Storage). Reemplaza a
// repository.fileStore.ts como backend de getRepository() (ver
// repository.ts) — mismo contrato (ProjectsRepository), mismo modelo de
// confianza: esta capa no hace chequeos de autorización, eso lo resuelven
// los route handlers de /api/admin (sesión) y /api/portal (token). Por eso
// usa la service_role key (bypassa RLS) en vez de la anon key: la anon key
// es "publicable" por diseño y las tablas no tienen policies para ella
// (RLS quedó en default-deny), así que exponerla no alcanzaría para leer o
// escribir nada — pero tampoco tiene sentido rutear todo por RLS cuando la
// autorización real ya vive en Next.js.
//
// SUPABASE_SERVICE_ROLE_KEY es secreta: nunca debe llegar al bundle de
// cliente ni loguearse. Este archivo solo se importa desde código server
// (route handlers / repository.ts), nunca desde un Client Component.

const STORAGE_BUCKET = "project-files";
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB, igual que repository.fileStore.ts

type ProjectRow = {
  id: string;
  token: string;
  client_name: string;
  project_name: string;
  status: ProjectStatus;
  notes: string;
  created_at: string;
  updated_at: string;
  last_seen_by_admin: string | null;
  last_seen_by_client: string | null;
  status_history: { status: ProjectStatus; changed_at: string }[];
  project_comments: {
    id: string;
    author: AuthorRole;
    author_name: string;
    body: string;
    created_at: string;
  }[];
  project_files: {
    id: string;
    name: string;
    size: number;
    mime_type: string;
    uploaded_by: AuthorRole;
    uploaded_at: string;
    storage_path: string;
  }[];
};

const PROJECT_SELECT = `
  id, token, client_name, project_name, status, notes,
  created_at, updated_at, last_seen_by_admin, last_seen_by_client,
  status_history ( status, changed_at ),
  project_comments ( id, author, author_name, body, created_at ),
  project_files ( id, name, size, mime_type, uploaded_by, uploaded_at, storage_path )
`;

function byIso<T>(getIso: (item: T) => string) {
  return (a: T, b: T) => getIso(a).localeCompare(getIso(b));
}

function toProject(row: ProjectRow): Project {
  return {
    id: row.id,
    token: row.token,
    clientName: row.client_name,
    projectName: row.project_name,
    status: row.status,
    statusHistory: row.status_history
      .map((h) => ({ status: h.status, changedAt: h.changed_at }))
      .sort(byIso((h) => h.changedAt)),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    notes: row.notes,
    comments: row.project_comments
      .map((c) => ({
        id: c.id,
        author: c.author,
        authorName: c.author_name,
        body: c.body,
        createdAt: c.created_at,
      }))
      .sort(byIso((c) => c.createdAt)),
    files: row.project_files
      .map((f) => ({
        id: f.id,
        name: f.name,
        size: f.size,
        mimeType: f.mime_type,
        uploadedBy: f.uploaded_by,
        uploadedAt: f.uploaded_at,
        storedName: f.storage_path,
      }))
      .sort(byIso((f) => f.uploadedAt)),
    lastSeenByAdmin: row.last_seen_by_admin,
    lastSeenByClient: row.last_seen_by_client,
  };
}

const getClient = getSupabaseAdminClient;

function nowIso() {
  return new Date().toISOString();
}

async function fetchProject(id: string): Promise<Project | undefined> {
  const { data, error } = await getClient()
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? toProject(data as unknown as ProjectRow) : undefined;
}

async function uniqueToken(clientName: string): Promise<string> {
  const base = slugify(clientName) || "cliente";
  const supabase = getClient();
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = `${base}-${randomUUID().slice(0, 6)}`;
    const { data, error } = await supabase
      .from("projects")
      .select("id")
      .eq("token", candidate)
      .maybeSingle();
    if (error) throw error;
    if (!data) return candidate;
  }
  return `${base}-${randomUUID()}`;
}

export const supabaseRepository: ProjectsRepository = {
  async list() {
    const { data, error } = await getClient()
      .from("projects")
      .select(PROJECT_SELECT)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as unknown as ProjectRow[]).map(toProject);
  },

  async getById(id) {
    return fetchProject(id);
  },

  async getByToken(token) {
    const { data, error } = await getClient()
      .from("projects")
      .select(PROJECT_SELECT)
      .eq("token", token)
      .maybeSingle();
    if (error) throw error;
    return data ? toProject(data as unknown as ProjectRow) : undefined;
  },

  async create(input: NewProjectInput) {
    const clientName = input.clientName.trim().slice(0, 120);
    const projectName = input.projectName.trim().slice(0, 160);
    const token = await uniqueToken(clientName);
    const ts = nowIso();
    const supabase = getClient();

    const { data: inserted, error } = await supabase
      .from("projects")
      .insert({
        token,
        client_name: clientName,
        project_name: projectName,
        status: "brief",
        notes: "",
        created_at: ts,
        updated_at: ts,
        last_seen_by_admin: ts,
        last_seen_by_client: null,
      })
      .select("id")
      .single();
    if (error) throw error;

    const { error: historyError } = await supabase
      .from("status_history")
      .insert({ project_id: inserted.id, status: "brief", changed_at: ts });
    if (historyError) throw historyError;

    const project = await fetchProject(inserted.id);
    if (!project) throw new Error("No se pudo leer el proyecto recién creado.");
    return project;
  },

  async updateStatus(id: string, status: ProjectStatus) {
    const supabase = getClient();
    const existing = await fetchProject(id);
    if (!existing) return undefined;

    const ts = nowIso();
    if (existing.status !== status) {
      const { error: historyError } = await supabase
        .from("status_history")
        .insert({ project_id: id, status, changed_at: ts });
      if (historyError) throw historyError;
    }

    const { error } = await supabase
      .from("projects")
      .update({ status, updated_at: ts })
      .eq("id", id);
    if (error) throw error;

    return fetchProject(id);
  },

  async updateNotes(id: string, notes: string) {
    const { error } = await getClient()
      .from("projects")
      .update({ notes: notes.slice(0, 4000), updated_at: nowIso() })
      .eq("id", id);
    if (error) throw error;
    return fetchProject(id);
  },

  async addComment(id: string, author: AuthorRole, authorName: string, body: string) {
    const trimmed = body.trim().slice(0, 4000);
    if (!trimmed) return undefined;
    const supabase = getClient();

    const existing = await fetchProject(id);
    if (!existing) return undefined;

    const ts = nowIso();
    const { data, error } = await supabase
      .from("project_comments")
      .insert({
        project_id: id,
        author,
        author_name: authorName,
        body: trimmed,
        created_at: ts,
      })
      .select("id, author, author_name, body, created_at")
      .single();
    if (error) throw error;

    const { error: updateError } = await supabase
      .from("projects")
      .update({ updated_at: ts })
      .eq("id", id);
    if (updateError) throw updateError;

    const comment: ProjectComment = {
      id: data.id,
      author: data.author,
      authorName: data.author_name,
      body: data.body,
      createdAt: data.created_at,
    };
    return comment;
  },

  async addFile(id: string, input: NewFileInput) {
    if (input.size > MAX_FILE_SIZE) {
      throw new Error("El archivo supera el límite de 20MB.");
    }
    const supabase = getClient();
    const existing = await fetchProject(id);
    if (!existing) return undefined;

    const fileId = randomUUID();
    const storagePath = `${id}/${fileId}`;
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, input.buffer, {
        contentType: input.mimeType || "application/octet-stream",
        upsert: false,
      });
    if (uploadError) throw uploadError;

    const ts = nowIso();
    const { data, error } = await supabase
      .from("project_files")
      .insert({
        project_id: id,
        name: input.name.slice(0, 200),
        size: input.size,
        mime_type: input.mimeType || "application/octet-stream",
        uploaded_by: input.uploadedBy,
        uploaded_at: ts,
        storage_path: storagePath,
      })
      .select("id, name, size, mime_type, uploaded_by, uploaded_at, storage_path")
      .single();
    if (error) {
      await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);
      throw error;
    }

    const { error: updateError } = await supabase
      .from("projects")
      .update({ updated_at: ts })
      .eq("id", id);
    if (updateError) throw updateError;

    const entry: ProjectFile = {
      id: data.id,
      name: data.name,
      size: data.size,
      mimeType: data.mime_type,
      uploadedBy: data.uploaded_by,
      uploadedAt: data.uploaded_at,
      storedName: data.storage_path,
    };
    return entry;
  },

  async getFileBuffer(projectId, fileId) {
    const supabase = getClient();
    const { data: fileRow, error } = await supabase
      .from("project_files")
      .select("id, name, size, mime_type, uploaded_by, uploaded_at, storage_path")
      .eq("project_id", projectId)
      .eq("id", fileId)
      .maybeSingle();
    if (error) throw error;
    if (!fileRow) return undefined;

    const { data: blob, error: downloadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .download(fileRow.storage_path);
    if (downloadError || !blob) return undefined;

    const buffer = new Uint8Array(await blob.arrayBuffer());
    const file: ProjectFile = {
      id: fileRow.id,
      name: fileRow.name,
      size: fileRow.size,
      mimeType: fileRow.mime_type,
      uploadedBy: fileRow.uploaded_by,
      uploadedAt: fileRow.uploaded_at,
      storedName: fileRow.storage_path,
    };
    return { buffer, file };
  },

  async deleteProject(id: string) {
    const supabase = getClient();
    const { data: files, error: filesError } = await supabase
      .from("project_files")
      .select("storage_path")
      .eq("project_id", id);
    if (filesError) throw filesError;

    const { error, count } = await supabase
      .from("projects")
      .delete({ count: "exact" })
      .eq("id", id);
    if (error) throw error;
    if (!count) return false;

    if (files && files.length > 0) {
      await supabase.storage
        .from(STORAGE_BUCKET)
        .remove(files.map((f) => f.storage_path));
    }
    return true;
  },

  async markSeenByAdmin(id: string) {
    const { error } = await getClient()
      .from("projects")
      .update({ last_seen_by_admin: nowIso() })
      .eq("id", id);
    if (error) throw error;
  },

  async markSeenByClient(id: string) {
    const { error } = await getClient()
      .from("projects")
      .update({ last_seen_by_client: nowIso() })
      .eq("id", id);
    if (error) throw error;
  },
};
