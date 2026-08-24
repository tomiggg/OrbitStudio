import { fileStoreRepository } from "./repository.fileStore";
import type {
  AuthorRole,
  Project,
  ProjectComment,
  ProjectFile,
  ProjectStatus,
  PublicProject,
} from "./types";

export type NewProjectInput = {
  clientName: string;
  projectName: string;
};

export type NewFileInput = {
  name: string;
  size: number;
  mimeType: string;
  uploadedBy: AuthorRole;
  buffer: Uint8Array;
};

export interface ProjectsRepository {
  list(): Promise<Project[]>;
  getById(id: string): Promise<Project | undefined>;
  getByToken(token: string): Promise<Project | undefined>;
  create(input: NewProjectInput): Promise<Project>;
  updateStatus(id: string, status: ProjectStatus): Promise<Project | undefined>;
  updateNotes(id: string, notes: string): Promise<Project | undefined>;
  addComment(
    id: string,
    author: AuthorRole,
    authorName: string,
    body: string
  ): Promise<ProjectComment | undefined>;
  addFile(id: string, input: NewFileInput): Promise<ProjectFile | undefined>;
  getFileBuffer(
    projectId: string,
    fileId: string
  ): Promise<{ buffer: Uint8Array; file: ProjectFile } | undefined>;
  deleteProject(id: string): Promise<boolean>;
  markSeenByAdmin(id: string): Promise<void>;
  markSeenByClient(id: string): Promise<void>;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function toPublicProject(project: Project): PublicProject {
  const { notes: _notes, files, ...rest } = project;
  void _notes;
  return {
    ...rest,
    files: files.map(({ storedName: _storedName, ...file }) => {
      void _storedName;
      return file;
    }),
  };
}

// Único punto de swap para conectar un backend real (Postgres/Supabase/etc):
// implementar ProjectsRepository en un archivo nuevo (ver
// repository.fileStore.ts como referencia de contrato) y devolver esa
// instancia acá en vez de fileStoreRepository. El resto de la app no cambia.
export function getRepository(): ProjectsRepository {
  return fileStoreRepository;
}
