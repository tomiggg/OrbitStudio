"use client";

import type { Service } from "@/lib/services";

type Props = {
  service: Service;
  isActive: boolean;
  onSelect: (id: string) => void;
};

export function ServiceCard({ service, isActive, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={() => onSelect(service.id)}
      className={[
        // layout
        "snap-start w-[86vw] sm:w-[360px] md:w-[360px] flex-none",
        "rounded-xl px-6 py-6 text-left transition",

        // fondo blanco REAL
        "bg-white",

        // sin bordes ni outlines feos
        "border-0 outline-none",

        // sombra premium
        "shadow-[0_12px_28px_rgba(0,0,0,0.10)]",
        "hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(0,0,0,0.16)]",

        // focus ultra discreto
        "focus-visible:ring-2 focus-visible:ring-[#0ABAB5]/30",

        // activo: glow suave, NO borde
        isActive ? "ring-2 ring-[#0ABAB5]/20" : "",
      ].join(" ")}
    >
      {/* Título */}
      <h3 className="text-xl font-extrabold tracking-[-0.03em] text-[#072b2a]">
        {service.title}
      </h3>

      {/* Precio (acento visual) */}
      <div className="mt-2 text-sm font-semibold text-[#0ABAB5]">
        Desde {service.priceFrom}
      </div>

      {/* Ideal para */}
      <p className="mt-3 text-sm leading-relaxed text-[#072b2a]/70">
        <span className="font-semibold text-[#072b2a]">Ideal para:</span>{" "}
        {service.idealFor}
      </p>

      {/* Highlights */}
      <ul className="mt-4 space-y-2 text-sm text-[#072b2a]/70">
        {service.highlights.map((h) => (
          <li key={h} className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#0ABAB5]" />
            <span>{h}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="mt-6">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#072b2a] group">
          Ver detalles
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-1 text-[#0ABAB5]"
          >
            →
          </span>
        </span>
      </div>
    </button>
  );
}