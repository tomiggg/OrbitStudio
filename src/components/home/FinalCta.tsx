"use client";

import { Container } from "@/components/ui/Container";

type FinalCtaProps = {
  onOpenContact?: () => void;
};

export function FinalCta({ onOpenContact }: FinalCtaProps) {
  const primaryBtn =
    "inline-flex items-center justify-center rounded-full bg-[#072b2a] px-7 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-[#061f1e] focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-[#0ABAB5]";

  return (
    <section
      id="contact"
      className="relative overflow-hidden py-16 md:py-20"
      style={{ backgroundColor: "#0ABAB5" }}
    >
      {/* separador superior suave como el hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-28"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(255,255,255,0))",
        }}
      />

      {/* glow suave */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[760px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl"
      />

      {/* noise igual espíritu del hero */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 cta-noise" />

      <Container>
        <div className="relative mx-auto max-w-5xl">
<div className="px-6 py-10 md:px-12 md:py-12">
            <div className="mx-auto max-w-3xl text-center">
              <h2
                className="font-extrabold tracking-[-0.06em] text-[#072b2a]"
                style={{ fontSize: "clamp(44px, 4.4vw, 72px)", lineHeight: "0.95" }}
              >
                ¿Hablamos de tu proyecto?
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#072b2a]/75 md:text-base">
                Te decimos qué conviene construir primero para vender, ordenar y escalar.
                Claro, rápido y sin compromiso.
              </p>

              <div className="mt-8 flex justify-center">
                <button type="button" onClick={() => onOpenContact?.()} className={primaryBtn}>
                  Hablá por WhatsApp
                </button>
              </div>

              <p className="mt-5 text-xs text-[#072b2a]/65">
                Respuesta en el día · Sin compromiso
              </p>
            </div>
          </div>
        </div>
      </Container>

      <style jsx>{`
        .cta-noise {
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
      `}</style>
    </section>
  );
}