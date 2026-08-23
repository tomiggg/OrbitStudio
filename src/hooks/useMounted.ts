"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

// true only after the client has hydrated — lets components read browser-only
// state (window, sessionStorage) without a server/client markup mismatch,
// without resorting to a setState-in-effect on mount.
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
