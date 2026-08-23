"use client";

// Mock auth — sin backend todavía. Gate simple por contraseña fija en el cliente.
// TODO(backend): reemplazar por auth real (NextAuth / sesión server-side) antes de producción.

const SESSION_KEY = "shiftstudio.admin.session.v1";
const MOCK_PASSWORD = "shiftstudio2026";

export function login(password: string): boolean {
  if (password !== MOCK_PASSWORD) return false;
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(SESSION_KEY, "1");
  }
  return true;
}

export function logout() {
  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem(SESSION_KEY);
  }
}

export function isAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(SESSION_KEY) === "1";
}
