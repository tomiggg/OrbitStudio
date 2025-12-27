"use client";

import type { Service } from "@/lib/services";
import { useEffect, useState } from "react";

type Props = {
  service: Service;
  onClose: () => void;
  onChoose: (title: string) => void;
};

export function ServiceDetailsMobileFlip({
  service,
  onClose,
  onChoose,
}: Props) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(false);
  }, [service.id]);

  return (
    <div className="px-5 pb-6 pt-5">
      {/* header mini */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-semibold text-[#072b2a]/60 hover:text-[#072b2a]"
        >
          Cerrar
        </button>

        <button
          type="button"
          onClick={() => setFlipped((v) => !v)}
          className={[
            "group inline-flex items-center gap-2 rounded-full",
            "border border-white/25 bg-white/15",
            "px-3 py-1.5 text-xs font-semibold",
            "text-[#072b2a]/75 hover:text-[#072b2a]",
            "transition",
          ].join(" ")}
        >
          {flipped ? "Ver info" : "Ver mockup"}
          <span
            aria-hidden
            className={[
              "h-[1px] w-6 bg-[#072b2a]/25 transition-all",
              "group-hover:w-9 group-hover:bg-[#0ABAB5]",
            ].join(" ")}
          />
        </button>
      </div>

      {/* flip wrapper */}
      <div className="flipWrap">
        <div className={`flipInner ${flipped ? "isFlipped" : ""}`}>
          {/* FRONT */}
          <div className="flipFace flipFront">
            <div className="cardShell">
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
                <div className="text-sm font-semibold text-[#072b2a]">
                  Highlights
                </div>
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

              <div className="mt-7">
                <div className="text-sm font-semibold text-[#072b2a]">
                  Incluye
                </div>
                <ul className="mt-3 space-y-2 text-sm text-[#072b2a]/70">
                  {service.includes.map((x) => (
                    <li key={x} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0abab5]" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-6">
                <button
                  type="button"
                  onClick={() => onChoose(service.title)}
                  className="w-full rounded-xl bg-[#072b2a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#061f1e]"
                >
                  Elegir este servicio
                </button>
              </div>
            </div>
          </div>

          {/* BACK */}
          <div className="flipFace flipBack">
            <div className="cardShell">
              <div className="text-sm font-semibold text-[#072b2a]">Mockup</div>

              <div className="mt-4 flex-1 rounded-2xl border border-white/20 bg-white/35 backdrop-blur-xl shadow-[0_22px_60px_rgba(0,0,0,0.18)]">
                <div className="h-full w-full bg-[#f4fdfd] p-2">
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

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => onChoose(service.title)}
                  className="w-full rounded-xl bg-[#072b2a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#061f1e]"
                >
                  Elegir este servicio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* styles */}
      <style jsx>{`
        .flipWrap {
          position: relative;
          perspective: 1400px;
          height: clamp(620px, 78vh, 760px);
        }

        .flipInner {
          position: relative;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .flipInner.isFlipped {
          transform: rotateY(180deg);
        }

        .flipFace {
          position: absolute;
          inset: 0;
          height: 100%;
          display: flex;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .flipFront {
          transform: rotateY(0deg);
        }

        .flipBack {
          transform: rotateY(180deg);
        }

        .cardShell {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.22);
          background: rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(18px);
          padding: 18px;
        }

        @media (prefers-reduced-motion: reduce) {
          .flipInner {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}