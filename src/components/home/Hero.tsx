"use client";

import { useEffect, useMemo } from "react";
import { useTypewriterLines } from "@/hooks/useTypewriterLines";

type HeroProps = { onOpenContact?: () => void };

export function Hero({ onOpenContact }: HeroProps) {
  const headlineLines = useMemo(() => ["Tu", "Marca", "Digital."], []);

  const { typedLines, done, cycle } = useTypewriterLines(headlineLines, {
    startDelayMs: 520,
    lineDelayMs: 240,
    charMs: 26,
    repeatDelayMs: 5000,
  });

  // Evita llegar con hash y quedar scrolleado
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, []);

  return (
    <section
      id="top"
      className="relative overflow-hidden"
      style={{
        minHeight: "100svh",
        background:
          "radial-gradient(circle at 20% 25%, rgba(255,255,255,0.18), rgba(255,255,255,0) 55%), radial-gradient(circle at 80% 70%, rgba(7,43,42,0.10), rgba(7,43,42,0) 55%), linear-gradient(180deg, #0ABAB5 0%, #09b2ad 55%, #0ABAB5 100%)",
      }}
    >
      {/* top fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-28"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(255,255,255,0))",
        }}
      />

      {/* noise */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hero-noise"
      />

      {/* MOBILE microcopy */}
      <div className="pointer-events-none absolute inset-x-0 bottom-10 z-30 md:hidden">
        <div className="px-5">
          {/* key en el wrapper animado para que reinicie cada ciclo */}
          <div
            key={cycle}
            className="pointer-events-auto hero-fade-slide flex items-start gap-4"
          >
            <div className="mt-1 h-12 w-px bg-[#072b2a]/20" />
            <div className="max-w-[520px]">
              <p className="text-xs font-extrabold tracking-wide text-[#072b2a]/70">
                RESPUESTA EN EL DÍA <span className="opacity-40">·</span> SIN
                COMPROMISO <span className="opacity-40">·</span> PRESUPUESTO
                CLARO
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#072b2a]/70">
                Diseño y desarrollo enfocado en conversión. Sin vueltas.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* WRAPPER */}
      <div className="relative mx-auto w-full max-w-[1100px] px-5 md:px-8">
        {/* ✅ NO pelear con header fixed: dejamos el wrapper estable */}
        <div
          className="
            flex items-start
            pt-24 pb-44
            md:pt-32 md:pb-24
          "
          style={{ minHeight: "100svh" }}
        >
          <div className="w-full">
            <div className="grid w-full gap-10 md:grid-cols-12 md:items-end">
              {/* LEFT – HEADLINE */}
              <div className="md:col-span-7">
                <div className="max-w-[820px]">
                  {/* ⛔ Reservorio fijo: NO tocar con mt/pt para mover el título */}
                  <div
                    className="
                      flex flex-col justify-end
                      [min-height:300px] sm:[min-height:360px] md:[min-height:460px] lg:[min-height:520px]
                    "
                  >
                    <h1
                      key={cycle} // reinicia fade+slide cada 5s
                      className="
                        hero-fade-slide
                        font-extrabold
                        tracking-[-0.06em]
                        text-[#072b2a]
                        translate-y-16 sm:translate-y-20 md:translate-y-0
                      "
                      style={{ lineHeight: "0.90" }}
                    >
                      {headlineLines.map((_, idx) => {
                        const txt = typedLines[idx] ?? "";
                        const isActiveLine =
                          idx ===
                          Math.min(
                            typedLines.length - 1,
                            headlineLines.length - 1
                          );

                        return (
                          <span
                            key={idx}
                            className="block"
                            style={{
                              fontSize:
                                idx === 1
                                  ? "clamp(106px, 10.2vw, 190px)"
                                  : idx === 0
                                  ? "clamp(112px, 10.8vw, 200px)"
                                  : "clamp(114px, 11.0vw, 204px)",
                            }}
                          >
                            <span className="align-top">
                              {txt && txt.length > 0 ? txt : "\u00A0"}
                            </span>

                            {isActiveLine && (
                              <span
                                aria-hidden="true"
                                className={[
                                  "ml-[2px] inline-block w-[12px] translate-y-[0.06em] bg-[#072b2a]",
                                  done ? "caret-blink" : "caret-solid",
                                ].join(" ")}
                                style={{ height: "0.9em" }}
                              />
                            )}
                          </span>
                        );
                      })}
                    </h1>
                  </div>
                </div>
              </div>

              {/* RIGHT – DESKTOP MICROCOPY */}
              <div className="hidden md:flex md:col-span-5 md:items-end">
                <div
                  key={cycle}
                  className="hero-fade-slide ml-10 max-w-[420px] -translate-y-10 lg:-translate-y-12"
                >
                  <div className="flex items-start gap-6">
                    <div className="h-14 w-px bg-[#072b2a]/20" />

                    <div>
                      <p className="text-base font-semibold leading-snug text-[#072b2a]/80">
                        Adaptamos tu negocio al mundo digital.
                      </p>

                      <p className="mt-3 text-sm font-medium tracking-wide leading-snug text-[#072b2a]/55">
                        Estrategia <span className="opacity-40">·</span> Diseño{" "}
                        <span className="opacity-40">·</span> Desarrollo
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* end grid */}
          </div>
        </div>
      </div>
    </section>
  );
}