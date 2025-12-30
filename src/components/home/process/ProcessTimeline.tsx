"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

type Props = {
  nodeYs: number[];
  leftClassName?: string;   // ej: "left-6"
  topClassName?: string;    // ej: "top-2"
  bottomClassName?: string; // ej: "bottom-2"
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
    if (ys.length < 2) return { yValues: [0, 420], times: [0, 1] };

    const min = Math.min(...ys);
    const normalized = ys.map((y) => y - min);

    const t = normalized.map((_, i) =>
      normalized.length === 1 ? 1 : i / (normalized.length - 1)
    );

    return { yValues: normalized, times: t };
  }, [nodeYs]);

  return (
    <>
      {/* TRACK base */}
      <div
        aria-hidden
        className={[
          "pointer-events-none absolute z-10", // arriba del contenido pero abajo de nodos
          leftClassName,
          topClassName,
          bottomClassName,
          "w-[3px] rounded-full",
          "-translate-x-1/2", // centra respecto al left-x del nodo (que ya usa -translate-x-1/2)
          "bg-[color:var(--link)]/25",
        ].join(" ")}
      />

      {/* TRACK glow */}
      <div
        aria-hidden
        className={[
          "pointer-events-none absolute z-10",
          leftClassName,
          topClassName,
          bottomClassName,
          "w-[11px] rounded-full",
          "-translate-x-1/2",
          "bg-[color:var(--link)]/10 blur-[10px]",
        ].join(" ")}
      />

      {/* DROP */}
      <motion.div
        aria-hidden
        className={[
          "pointer-events-none absolute z-10",
          leftClassName,
          topClassName,
          "w-[14px]",
          "-translate-x-1/2",
        ].join(" ")}
        animate={{ y: yValues }}
        transition={{
          duration: durationSec,
          repeat: Infinity,
          ease: "linear",
          times,
        }}
      >
        <div className="relative h-[56px] w-[14px] rounded-full bg-[color:var(--link)] shadow-[0_14px_30px_rgba(10,186,181,0.28)]" />
        <div className="absolute inset-0 rounded-full bg-[color:var(--link)]/25 blur-[12px]" />
      </motion.div>
    </>
  );
}