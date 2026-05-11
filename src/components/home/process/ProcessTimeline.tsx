"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

type Props = {
  nodeYs: number[];
  leftClassName?: string;
  durationSec?: number;
};

export function ProcessTimeline({
  nodeYs,
  leftClassName = "left-8",
  durationSec = 5,
}: Props) {
  const { yValues, times } = useMemo(() => {
    const ys = (nodeYs ?? []).filter((n) => Number.isFinite(n));
    if (ys.length < 2) return { yValues: [0, 0], times: [0, 1] };

    const min = Math.min(...ys);
    const normalized = ys.map((y) => y - min);
    const t = normalized.map((_, i) => i / (normalized.length - 1));

    return { yValues: normalized, times: t };
  }, [nodeYs]);

  const topPos = nodeYs.length > 0 ? Math.min(...nodeYs) : 0;
  const bottomPos = nodeYs.length > 0 ? Math.max(...nodeYs) : 0;
  const height = bottomPos - topPos;

  return (
    <div 
      className={`absolute ${leftClassName} -translate-x-1/2 pointer-events-none z-10`}
      style={{ top: topPos, height: height }}
    >
      {/* Track Base: Negro con baja opacidad para un look industrial */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-black/10" />

      {/* Track Animado (Glow opcional) */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-[#0abab5]/20 blur-[2px]" />

      {/* Gota Técnica (El Pulso) */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-[2px] z-20"
        animate={{ y: yValues }}
        transition={{
          duration: durationSec,
          repeat: Infinity,
          ease: "linear",
          times,
        }}
      >
        {/* La "Gota" ahora es una línea de luz brillante */}
        <div className="relative h-20 w-full bg-gradient-to-b from-transparent via-[#0abab5] to-transparent">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-[#0abab5] shadow-[0_0_15px_#0abab5]" />
        </div>
      </motion.div>
    </div>
  );
}