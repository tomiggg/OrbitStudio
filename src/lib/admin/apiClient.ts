import type {
  Project,
  ProjectComment,
  ProjectStatus,
  PublicProject,
} from "./types";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError((data && data.error) || `Error ${res.status}`, res.status);
  }
  return data as T;
}

export function fetchProjects(): Promise<Project[]> {
  return request("/api/admin/projects");
}

export function fetchProject(id: string): Promise<Project> {
  return request(`/api/admin/projects/${id}`);
}

export function fetchProjectByToken(token: string): Promise<PublicProject> {
  return request(`/api/portal/projects/${token}`);
}

export function createProjectApi(input: {
  clientName: string;
  projectName: string;
}): Promise<Project> {
  return request("/api/admin/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function updateStatusApi(id: string, status: ProjectStatus): Promise<Project> {
  return request(`/api/admin/projects/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}

export function updateNotesApi(id: string, notes: string): Promise<Project> {
  return request(`/api/admin/projects/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ notes }),
  });
}

export function deleteProjectApi(id: string): Promise<{ ok: true }> {
  return request(`/api/admin/projects/${id}`, { method: "DELETE" });
}

export function addAdminCommentApi(id: string, body: string): Promise<ProjectComment> {
  return request(`/api/admin/projects/${id}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body }),
  });
}

export function addClientCommentApi(token: string, body: string): Promise<ProjectComment> {
  return request(`/api/portal/projects/${token}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body }),
  });
}

export function fileDownloadUrl(projectId: string, fileId: string): string {
  return `/api/files/${projectId}/${fileId}`;
}

export function markSeenByAdminApi(id: string): Promise<{ ok: true }> {
  return request(`/api/admin/projects/${id}/seen`, { method: "POST" });
}

export function markSeenByClientApi(token: string): Promise<{ ok: true }> {
  return request(`/api/portal/projects/${token}/seen`, { method: "POST" });
}
