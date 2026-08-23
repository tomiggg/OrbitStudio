"use client";

import { useSyncExternalStore } from "react";
import { getProjectById, getProjectByToken, getServerSnapshot, getSnapshot, subscribe } from "./store";
import type { Project } from "./types";

export function useProjects(): Project[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useProject(id: string): Project | undefined {
  const projects = useProjects();
  return projects.find((p) => p.id === id) ?? getProjectById(id);
}

export function useProjectByToken(token: string): Project | undefined {
  const projects = useProjects();
  return projects.find((p) => p.token === token) ?? getProjectByToken(token);
}
