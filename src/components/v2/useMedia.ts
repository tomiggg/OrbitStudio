"use client";

import { useMotionValue, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useSyncExternalStore, type RefObject } from "react";

export function useMedia(query: string, server = false) {
  return useSyncExternalStore(
    (cb) => {
      const m = matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => matchMedia(query).matches,
    () => server,
  );
}

export const useIsMobile = () => useMedia("(max-width: 900px)");

/**
 * Progreso de scroll de una sección (0→1) como MotionValue "de JS".
 * framer-motion acelera opacidades/escalas atadas directo a useScroll con
 * ScrollTimeline nativo, y en esa ruta ignora `target`/`offset` (usa el
 * scroll de toda la página). Copiar el valor a un MotionValue propio evita
 * esa ruta y respeta el rango de la sección.
 */
export function useSectionProgress(
  ref: RefObject<HTMLElement | null>,
  offset: NonNullable<Parameters<typeof useScroll>[0]>["offset"] = ["start start", "end end"],
) {
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const mv = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => mv.set(v));
  useEffect(() => {
    mv.set(scrollYProgress.get());
  }, [mv, scrollYProgress]);
  return mv;
}
