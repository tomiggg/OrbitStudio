"use client";

import { useCallback, useSyncExternalStore } from "react";
import { getProject, getProjectsSnapshot, subscribe } from "@/lib/admin/store";
import type { ClientProject } from "@/lib/admin/types";

const EMPTY: ClientProject[] = [];

export function useProjects(): ClientProject[] {
  return useSyncExternalStore(
    subscribe,
    () => getProjectsSnapshot(),
    () => EMPTY
  );
}

export function useProject(id: string): ClientProject | undefined {
  const getSnapshot = useCallback(() => getProject(id), [id]);
  return useSyncExternalStore(subscribe, getSnapshot, () => undefined);
}
