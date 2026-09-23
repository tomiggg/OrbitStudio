"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  type HTMLMotionProps,
} from "framer-motion";
import { Fragment, useRef, type ElementType, type ReactNode } from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Texto que entra palabra por palabra desde una máscara.
 * `*así*` marca un tramo en serif itálica.
 */
export function MaskText({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
  stagger = 0.045,
  animate,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  /** Si se pasa, controla la animación en vez de detectar la entrada en pantalla. */
  animate?: boolean;
}) {
  // Se observa el título entero: cada palabra arranca escondida detrás de su
  // máscara (overflow hidden), así que observarlas una por una nunca dispara.
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const shown = animate ?? inView;
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  let i = 0;
  const lines = text.split("\n").length > 1;
  const word = (w: string, serif: boolean, key: string) => {
    const idx = i++;
    return (
      <span className="mk" key={key}>
        <motion.span
          className={serif ? "sf" : undefined}
          initial={{ y: "110%" }}
          animate={{ y: shown ? "0%" : "110%" }}
          transition={{ duration: 1, ease: EASE, delay: delay + idx * stagger }}
        >
          {w}
        </motion.span>
      </span>
    );
  };
  return (
    <Tag ref={ref} className={className} aria-label={text.replace(/\*/g, "")}>
      <span aria-hidden="true">
        {parts.map((part, pi) => {
          const serif = part.startsWith("*");
          const clean = serif ? part.slice(1, -1) : part;
          return clean.split(/(\n| )/).map((w, wi) => {
            if (w === "\n") return lines ? <br key={`${pi}-${wi}`} /> : null;
            if (w === " ") return <Fragment key={`${pi}-${wi}`}> </Fragment>;
            if (!w) return null;
            return word(w, serif, `${pi}-${wi}`);
          });
        })}
      </span>
    </Tag>
  );
}

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  ...rest
}: { children: ReactNode; delay?: number; y?: number } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.1, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Línea divisoria que se dibuja al entrar en pantalla. */
export function Rule({ delay = 0 }: { delay?: number }) {
  return (
    <motion.span
      className="rule"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.4, ease: EASE, delay }}
    />
  );
}

/** Texto con hover "rodante": la copia de abajo sube y reemplaza a la de arriba. */
export function Roll({ children }: { children: string }) {
  return (
    <span className="roll">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}

/** Envuelve un botón para que siga levemente al cursor. */
export function Magnetic({
  children,
  strength = 0.3,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 16, mass: 0.4 });
  return (
    <motion.span
      ref={ref}
      className={`mag ${className ?? ""}`}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}
