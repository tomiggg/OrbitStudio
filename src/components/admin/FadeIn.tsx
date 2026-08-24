"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

// A diferencia de Reveal (src/components/ui/Reveal.tsx), que anima al
// entrar en viewport — pensado para páginas largas de scroll storytelling —
// esto anima siempre al montar. El portal/admin son pantallas cortas donde
// casi todo el contenido ya está en el viewport en la carga inicial, y
// `whileInView` con contenido ya visible depende de que el IntersectionObserver
// dispare en el primer chequeo — algo que no todos los navegadores/entornos
// garantizan igual, y que puede dejar contenido en opacity:0 indefinidamente.
export function FadeIn({
  children,
  delay = 0,
  y = 16,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
