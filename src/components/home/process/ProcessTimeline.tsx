"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

type Props = {
  /** posiciones Y (px) relativas al wrapper */
  nodeYs: number[];

  /** Posición horizontal (tailwind) */
  leftClassName?: string;

  /** Ajuste superior/inferior del track */
  topClassName?: string;
  bottomClassName?: string;

  /** duración total del recorrido */
  durationSec?: number;
};

export function ProcessTimeline({
  nodeYs,
  leftClassName = "left-6",
  topClassName = "top-2",
  bottomClassName = "bottom-2",
  durationSec = 7.5,
}: Props) {
  const { yValues, times } = useMemo(() => {
    const ys = (nodeYs ?? []).filter((n) => Number.isFinite(n));

    // fallback si todavía no midió
    if (ys.length < 2) {
      return {
        yValues: [0, 420],
        times: [0, 1],
      };
    }

    const min = Math.min(...ys);
    const max = Math.max(...ys);

    // normalizamos para que el motion sea relativo al min
    const normalized = ys.map((y) => y - min);

    // tiempos uniformes (misma “velocidad” en todo el recorrido)
    const t = normalized.map((_, i) => (normalized.length === 1 ? 1 : i / (normalized.length - 1)));

    return { yValues: normalized, times: t };
  }, [nodeYs]);

  return (
    <>
      {/* Track base */}
      <div
        aria-hidden
        className={[
          "pointer-events-none absolute",
          leftClassName,
          topClassName,
          bottomClassName,
          "w-[3px] rounded-full",
          "bg-[color:var(--link)]/25",
        ].join(" ")}
      />

      {/* Glow del track (suave) */}
      <div
        aria-hidden
        className={[
          "pointer-events-none absolute",
          leftClassName,
          topClassName,
          bottomClassName,
          "w-[11px] -translate-x-[4px] rounded-full",
          "bg-[color:var(--link)]/10 blur-[10px]",
        ].join(" ")}
      />

      {/* Drop wrapper */}
      <motion.div
        aria-hidden
        className={[
          "pointer-events-none absolute",
          leftClassName,
          topClassName,
          "w-[14px] -translate-x-[5.5px]",
        ].join(" ")}
        animate={{ y: yValues }}
        transition={{
          duration: durationSec,
          repeat: Infinity,
          ease: "linear",
          times,
        }}
      >
        {/* cuerpo de la gota */}
        <div className="relative h-[56px] w-[14px] rounded-full bg-[color:var(--link)] shadow-[0_14px_30px_rgba(10,186,181,0.28)]" />
        {/* glow de la gota */}
        <div className="absolute inset-0 rounded-full bg-[color:var(--link)]/25 blur-[12px]" />
      </motion.div>
    </>
  );
}