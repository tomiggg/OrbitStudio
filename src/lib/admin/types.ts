export type ProjectStatus =
  | "brief"
  | "diseno"
  | "desarrollo"
  | "revision"
  | "entregado";

export const PROJECT_STATUS_ORDER: ProjectStatus[] = [
  "brief",
  "diseno",
  "desarrollo",
  "revision",
  "entregado",
];

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  brief: "Brief",
  diseno: "Diseño",
  desarrollo: "Desarrollo",
  revision: "Revisión",
  entregado: "Entregado",
};

export type AuthorRole = "admin" | "client";

export type ProjectComment = {
  id: string;
  author: AuthorRole;
  authorName: string;
  body: string;
  createdAt: string; // ISO
};

export type ProjectFile = {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  uploadedBy: AuthorRole;
  uploadedAt: string; // ISO
  storedName: string; // nombre del archivo en data/uploads/<projectId>/, no exponer al cliente
};

export type StatusChange = {
  status: ProjectStatus;
  changedAt: string; // ISO
};

export type Project = {
  id: string;
  token: string; // slug usado en el link/QR del portal cliente
  clientName: string;
  projectName: string;
  status: ProjectStatus;
  statusHistory: StatusChange[];
  createdAt: string; // ISO
  updatedAt: string; // ISO
  notes: string;
  comments: ProjectComment[];
  files: ProjectFile[];
  lastSeenByAdmin: string | null; // ISO
  lastSeenByClient: string | null; // ISO
};

// Proyección pública: lo que ve el portal cliente. Nunca incluye `notes`
// (notas internas del equipo) ni `storedName` de los archivos.
export type PublicProjectFile = Omit<ProjectFile, "storedName">;

export type PublicProject = Omit<Project, "notes" | "files"> & {
  files: PublicProjectFile[];
};
