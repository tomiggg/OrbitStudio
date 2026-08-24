"use client";

import { useCallback, useEffect, useState } from "react";
import type { Project, PublicProject } from "./types";
import { ApiError, fetchProject, fetchProjectByToken, fetchProjects } from "./apiClient";

const POLL_INTERVAL_MS = 15000;

type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  notFound: boolean;
};

function useAsyncResource<T>(fetcher: () => Promise<T>, initialData?: T) {
  const [state, setState] = useState<AsyncState<T>>({
    data: initialData ?? null,
    loading: initialData === undefined,
    error: null,
    notFound: false,
  });

  const refresh = useCallback(async () => {
    try {
      const data = await fetcher();
      setState({ data, loading: false, error: null, notFound: false });
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) {
        setState({ data: null, loading: false, error: null, notFound: true });
        return;
      }
      setState((prev) => ({
        data: prev.data,
        loading: false,
        error: e instanceof Error ? e.message : "Error inesperado.",
        notFound: false,
      }));
    }
  }, [fetcher]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!cancelled) await refresh();
    })();

    function onFocus() {
      refresh();
    }
    window.addEventListener("focus", onFocus);
    const interval = setInterval(refresh, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      window.removeEventListener("focus", onFocus);
      clearInterval(interval);
    };
  }, [refresh]);

  return { ...state, refresh };
}

export function useProjects(initialData?: Project[]) {
  const fetcher = useCallback(() => fetchProjects(), []);
  return useAsyncResource<Project[]>(fetcher, initialData);
}

export function useProject(id: string, initialData?: Project) {
  const fetcher = useCallback(() => fetchProject(id), [id]);
  return useAsyncResource<Project>(fetcher, initialData);
}

export function useProjectByToken(token: string, initialData?: PublicProject) {
  const fetcher = useCallback(() => fetchProjectByToken(token), [token]);
  return useAsyncResource<PublicProject>(fetcher, initialData);
}
