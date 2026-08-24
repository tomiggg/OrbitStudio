"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics/track";

// Un pageview por cambio de ruta client-side. No usa useSearchParams a
// propósito — leer window.location.search dentro de track() alcanza para
// UTMs y evita el requisito de <Suspense> que trae ese hook.
export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    track(ANALYTICS_EVENTS.pageview);
  }, [pathname]);

  return null;
}
