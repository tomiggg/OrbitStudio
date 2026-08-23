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
  dataUrl: string;
};

export type Project = {
  id: string;
  token: string; // slug usado en el link/QR del portal cliente
  clientName: string;
  projectName: string;
  status: ProjectStatus;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  notes: string;
  comments: ProjectComment[];
  files: ProjectFile[];
};
