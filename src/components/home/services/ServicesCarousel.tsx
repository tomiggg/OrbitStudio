"use client";

import { useRef } from "react";
import type { Service } from "@/lib/services";
import { ServiceCard } from "./ServiceCard";

type Props = {
  services: Service[];
  selectedId: string | null;
  onSelect: (id: string) => void;

  /** color base del fondo (para los fades laterales) */
  fadeBg?: string; // ej: "rgba(232, 232, 232, 1)"
};

export function ServicesCarousel({
  services,
  selectedId,
  onSelect,
  fadeBg = "rgba(167,233,231,1)",
}: Props) {
  const railRef = useRef<HTMLDivElement | null>(null);

  function scrollByCards(dir: "left" | "right") {
    const el = railRef.current;
    if (!el) return;

    const amount = Math.min(420, Math.max(280, Math.floor(el.clientWidth * 0.85)));
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  }

  const arrowBtnClass =
    "absolute top-1/2 z-20 -translate-y-1/2 rounded-xl px-3 py-2 text-sm font-semibold text-[#072b2a] bg-white/10 backdrop-blur border border-white/20 shadow-[0_8px_22px_rgba(0,0,0,0.10)] hover:bg-white/14";

  return (
    <div className="relative mt-12">
      {/* Fade edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10"
        style={{
          background: `linear-gradient(to right, ${fadeBg}, rgba(167,233,231,0))`,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10"
        style={{
          background: `linear-gradient(to left, ${fadeBg}, rgba(167,233,231,0))`,
        }}
      />

      {/* Flechas (desktop) */}
      <div className="hidden md:block">
        <button
          type="button"
          onClick={() => scrollByCards("left")}
          className={`${arrowBtnClass} left-0`}
          aria-label="Anterior"
        >
          <span aria-hidden="true">&larr;</span>
        </button>

        <button
          type="button"
          onClick={() => scrollByCards("right")}
          className={`${arrowBtnClass} right-0`}
          aria-label="Siguiente"
        >
          <span aria-hidden="true">&rarr;</span>
        </button>
      </div>

      {/* Rail */}
<div
  ref={railRef}
  className="
    flex items-stretch gap-6 overflow-x-auto py-2 pb-4
    px-1 sm:px-2 md:px-0
    snap-x snap-mandatory
    scroll-smooth
    [-ms-overflow-style:none]
    [scrollbar-width:none]
    [&::-webkit-scrollbar]:hidden
  "
>
        {services.map((s) => (
          <ServiceCard
            key={s.id}
            service={s}
            isActive={s.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}