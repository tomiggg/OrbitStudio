"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  type HTMLMotionProps,
} from "framer-motion";
import { Fragment, useRef, type ElementType, type ReactNode } from "react";

/*
 * Identidad de movimiento (personalidad "Premium": controlada, sin rebote).
 * Tres constantes para toda la página:
 *   - Curvas: EASE (entradas, desacelera — la curva firma), EASE_IN (salidas,
 *     acelera) y EASE_IO (movimiento en pantalla / cortinas).
 *   - Duraciones: DUR.quick / base / slow / reveal.
 *   - Entrada: subir desde una máscara o 24px + opacidad. Nunca solo opacidad.
 * Las salidas duran ~70% de su entrada. Los escalonados no pasan de ~0.5s en
 * total (STAGGER_BUDGET). Mismos valores en v2.css como --ease / --ease-in / --ease-io.
 */
export const EASE = [0.22, 1, 0.36, 1] as const;
export const EASE_IN = [0.64, 0, 0.78, 0] as const;
export const EASE_IO = [0.76, 0, 0.24, 1] as const;
export const DUR = { quick: 0.35, base: 0.6, slow: 0.9, reveal: 1.1 } as const;
export const STAGGER_BUDGET = 0.5;

/** Paso de escalonado que respeta el presupuesto total para `count` elementos. */
export const stagger = (count: number, step: number, budget = STAGGER_BUDGET) =>
  count > 1 ? Math.min(step, budget / (count - 1)) : 0;

/**
 * Texto que entra palabra por palabra desde una máscara.
 * `*así*` marca un tramo en serif itálica.
 */
export function MaskText({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
  stagger: step = 0.045,
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
  // Títulos largos: el escalonado se comprime para no pasar del presupuesto.
  const each = stagger(text.replace(/\*/g, "").split(/\s+/).filter(Boolean).length, step);
  let i = 0;
  const lines = text.split("\n").length > 1;
  const word = (w: string, serif: boolean, key: string) => {
    const idx = i++;
    return (
      <span className="mk" key={key}>
        <motion.span
          className={serif ? "sf" : undefined}
          initial={{ y: "110%", rotate: 3 }}
          animate={shown ? { y: "0%", rotate: 0 } : { y: "110%", rotate: 3 }}
          transition={{ duration: DUR.slow, ease: EASE, delay: delay + idx * each }}
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
  y = 24,
  className,
  ...rest
}: { children: ReactNode; delay?: number; y?: number } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: DUR.slow, ease: EASE, delay }}
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
      transition={{ duration: DUR.reveal, ease: EASE, delay }}
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
