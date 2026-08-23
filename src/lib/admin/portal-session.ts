"use client";

const KEY_PREFIX = "shiftstudio.portal.session.";

export function isPortalUnlocked(projectId: string): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(KEY_PREFIX + projectId) === "1";
}

export function unlockPortal(projectId: string) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(KEY_PREFIX + projectId, "1");
}
