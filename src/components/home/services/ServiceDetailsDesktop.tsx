"use client";

import type { Service } from "@/lib/services";

type Props = {
  service: Service;
  onClose: () => void;
  onChoose: (title: string) => void;
};

export function ServiceDetailsDesktop({ service, onClose, onChoose }: Props) {
  return (
    <div className="grid md:grid-cols-2">
      {/* LEFT */}
      <div className="px-8 py-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-extrabold tracking-[-0.04em] text-[#072b2a]">
              {service.title}
            </h3>
            <p className="mt-1 text-sm text-[#072b2a]/60">
              Ideal para:{" "}
              <span className="font-semibold text-[#072b2a]/80">
                {service.idealFor}
              </span>
            </p>
          </div>

          <div className="shrink-0 text-right">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-[#072b2a]/45">
              Desde
            </div>
            <div className="mt-1 inline-flex items-center rounded-full border border-white/30 bg-white/35 px-3 py-1 text-sm font-extrabold text-[#072b2a]">
              {service.priceFrom}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="text-sm font-semibold text-[#072b2a]">Highlights</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {service.highlights.map((h) => (
              <span
                key={h}
                className="inline-flex items-center rounded-full border border-white/25 bg-white/20 px-3 py-1 text-xs font-semibold text-[#072b2a]/80"
              >
                {h}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-2">
          <div>
            <div className="text-sm font-semibold text-[#072b2a]">Incluye</div>
            <ul className="mt-3 space-y-2 text-sm text-[#072b2a]/70">
              {service.includes.map((x) => (
                <li key={x} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0abab5]" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-[#072b2a]">
              Extras opcionales
            </div>
            <ul className="mt-3 space-y-2 text-sm text-[#072b2a]/70">
              {service.extras.map((e) => (
                <li key={e.name} className="flex items-start justify-between gap-4">
                  <span>{e.name}</span>
                  <span className="shrink-0 font-extrabold text-[#072b2a]">
                    {e.price}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/20 px-5 py-3 text-sm font-semibold text-[#072b2a] transition hover:bg-white/30"
          >
            Cerrar
          </button>

          <button
            type="button"
            onClick={() => onChoose(service.title)}
            className="inline-flex items-center justify-center rounded-xl bg-[#072b2a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#061f1e]"
          >
            Elegir este servicio
          </button>
        </div>
      </div>

      {/* RIGHT */}
      <div className="relative min-h-[520px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(10,186,181,0.28),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(7,43,42,0.10),transparent_55%)]" />

        <div className="relative flex h-full items-start justify-center p-7">
          <div className="w-full max-w-[300px]">
            <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/35 backdrop-blur-xl shadow-[0_22px_60px_rgba(0,0,0,0.18)]">
              <div className="aspect-[10/16] w-full bg-[#f4fdfd]">
                <img
                  src={service.mockupSrc}
                  alt={`Mockup ${service.title}`}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="mt-4 text-center text-xs font-semibold text-[#072b2a]/60">
              Mockup de referencia · adaptamos el diseño a tu marca
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}