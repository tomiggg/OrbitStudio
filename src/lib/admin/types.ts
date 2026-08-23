export type ProjectStage =
  | "briefing"
  | "diseno"
  | "desarrollo"
  | "revision"
  | "entregado";

export type ProjectStatus = "activo" | "pausado" | "completado";

export type AttachmentKind = "image" | "pdf" | "doc" | "other";

export type AttachmentMeta = {
  id: string;
  name: string;
  sizeLabel: string;
  kind: AttachmentKind;
  dataUrl?: string;
  uploadedAt: string;
  uploadedBy: "admin" | "client";
};

export type CommentEntry = {
  id: string;
  author: "admin" | "client";
  authorName: string;
  body: string;
  createdAt: string;
  attachments: AttachmentMeta[];
};

export type StageEvent = {
  stage: ProjectStage;
  enteredAt: string;
  note?: string;
};

export type ClientProject = {
  id: string;
  clientName: string;
  clientCompany?: string;
  clientEmail?: string;
  clientPhone?: string;
  title: string;
  summary: string;
  status: ProjectStatus;
  stage: ProjectStage;
  stageHistory: StageEvent[];
  progressPct: number;
  startedAt: string;
  dueAt?: string;
  budgetLabel?: string;
  accessCode: string;
  comments: CommentEntry[];
  attachments: AttachmentMeta[];
  createdAt: string;
  updatedAt: string;
};

export type NewProjectInput = {
  clientName: string;
  clientCompany?: string;
  clientEmail?: string;
  clientPhone?: string;
  title: string;
  summary: string;
  dueAt?: string;
  budgetLabel?: string;
};
