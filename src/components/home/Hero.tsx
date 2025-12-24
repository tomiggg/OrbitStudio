"use client";

type HeroProps = {
  onOpenContact?: () => void;
};

export function Hero({ onOpenContact }: HeroProps) {
  const primaryBtn =
    "hero-cta hero-cta-1 inline-flex items-center justify-center rounded-full bg-[#072b2a] px-7 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-[#061f1e] focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-[#0ABAB5]";

  const secondaryBtn =
    "hero-cta hero-cta-2 inline-flex items-center justify-center rounded-full border border-white/25 bg-white/12 px-7 py-3 text-sm font-semibold text-[#072b2a] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/18 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-[#0ABAB5]";

  const scrollBtn =
    "hero-cta hero-cta-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-[#072b2a]/80 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/16";

  return (
    <section
      id="top"
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: "#0ABAB5" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-28"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(255,255,255,0))",
        }}
      />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hero-noise" />

      {/* NOTE: sin pt acá, para no duplicar */}
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1100px] flex-col px-5 pb-10 md:px-8 md:pb-12">
        {/* ✅ Este pt es el ÚNICO control para bajar TODO el hero */}
        <div className="flex flex-1 items-start pt-28 md:pt-36">
          <div className="w-full">
            {/* MAIN ROW */}
            <div className="grid w-full gap-10 md:grid-cols-12 md:items-start">
              {/* LEFT */}
              <div className="md:col-span-8">
                <div className="max-w-[780px]">
                  <h1 className="font-extrabold tracking-[-0.06em] text-[#072b2a]">
                    <span
                      className="block hero-line hero-line-1"
                      style={{ fontSize: "clamp(96px, 9.4vw, 176px)", lineHeight: "0.92" }}
                    >
                      Tu
                    </span>
                    <span
                      className="block hero-line hero-line-2"
                      style={{ fontSize: "clamp(92px, 8.9vw, 168px)", lineHeight: "0.92" }}
                    >
                      Marca
                    </span>
                    <span
                      className="block hero-line hero-line-3"
                      style={{ fontSize: "clamp(98px, 9.6vw, 178px)", lineHeight: "0.92" }}
                    >
                      Digital.
                    </span>
                  </h1>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <button type="button" onClick={() => onOpenContact?.()} className={primaryBtn}>
                      Hablá por WhatsApp
                    </button>

                    <a href="#process" className={secondaryBtn}>
                      Ver cómo trabajamos
                    </a>
                  </div>

                  {/* MOBILE SUPPORT */}
                  <p className="mt-6 text-sm leading-relaxed text-[#072b2a]/80 md:hidden">
                    Respuesta en el día · Sin compromiso · Presupuesto claro
                    <span className="mt-2 block opacity-80">
                      Diseño y desarrollo enfocado en conversión. Sin vueltas.
                    </span>
                  </p>
                </div>
              </div>

              {/* Spacer col on desktop */}
              <div className="hidden md:block md:col-span-4" />
            </div>

            {/* DESKTOP SUPPORT (bottom-right, no box) */}
            <div className="hidden md:block hero-right-abs">
              <div className="flex items-start gap-6">
                <div className="mt-1 h-14 w-px bg-[#072b2a]/20" aria-hidden="true" />
                <div className="max-w-[420px]">
                  <p className="text-sm font-semibold text-[#072b2a]/85">
                    Respuesta en el día <span className="opacity-40">·</span> Sin compromiso{" "}
                    <span className="opacity-40">·</span> Presupuesto claro
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-[#072b2a]/70">
                    Diseño y desarrollo enfocado en conversión. Sin vueltas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="mt-10 flex items-center justify-center">
          <a href="#services" className={scrollBtn} aria-label="Ir a servicios">
            ↓
          </a>
        </div>
      </div>

      <style jsx>{`
        .hero-noise {
          opacity: 0.07;
          mix-blend-mode: overlay;
          background-image: repeating-linear-gradient(
              0deg,
              rgba(255, 255, 255, 0.08) 0px,
              rgba(255, 255, 255, 0.08) 1px,
              transparent 1px,
              transparent 3px
            ),
            repeating-linear-gradient(
              90deg,
              rgba(0, 0, 0, 0.05) 0px,
              rgba(0, 0, 0, 0.05) 1px,
              transparent 1px,
              transparent 4px
            );
        }

        /* Bottom-right placement (desktop) */
        .hero-right-abs {
          position: absolute;
          right: 0px;
          bottom: 140px;
        }

        .hero-line {
          opacity: 0;
          transform: translateY(10px);
          animation: inUp 240ms ease-out forwards;
        }
        .hero-line-1 {
          animation-delay: 60ms;
        }
        .hero-line-2 {
          animation-delay: 120ms;
        }
        .hero-line-3 {
          animation-delay: 180ms;
        }

        .hero-cta {
          opacity: 0;
          transform: translateY(8px);
          animation: inUp 220ms ease-out forwards;
        }
        .hero-cta-1 {
          animation-delay: 220ms;
        }
        .hero-cta-2 {
          animation-delay: 260ms;
        }
        .hero-cta-3 {
          animation-delay: 320ms;
        }

        @keyframes inUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .hero-right-abs {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}