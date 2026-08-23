"use client";

import { useSyncExternalStore } from "react";

// Auth mock: sin backend todavía, la sesión vive en localStorage del
// navegador y la "contraseña" es un valor fijo en el bundle del cliente.
// Esto NO es seguro para producción (ver PROGRESS.md) — sirve para no
// dejar /admin completamente abierto mientras se resuelve auth real.
const SESSION_KEY = "shift-studio-admin-session-v1";
const ADMIN_PASSWORD = "shiftstudio2026";

export type AdminSession = { name: string };

const listeners = new Set<() => void>();

function readSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AdminSession;
    return parsed.name ? parsed : null;
  } catch {
    return null;
  }
}

let cache: AdminSession | null | undefined = undefined;

function ensureCache(): AdminSession | null {
  if (cache === undefined) cache = readSession();
  return cache;
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === SESSION_KEY) {
      cache = undefined;
      listeners.forEach((fn) => fn());
    }
  });
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): AdminSession | null {
  return ensureCache();
}

function getServerSnapshot(): AdminSession | null {
  return null;
}

export function useAdminSession(): AdminSession | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function loginAdmin(name: string, password: string): boolean {
  if (password !== ADMIN_PASSWORD) return false;
  const session: AdminSession = { name: name.trim() || "Shift Studio" };
  cache = session;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  listeners.forEach((fn) => fn());
  return true;
}

export function logoutAdmin() {
  cache = null;
  window.localStorage.removeItem(SESSION_KEY);
  listeners.forEach((fn) => fn());
}
