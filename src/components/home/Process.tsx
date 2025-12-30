"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { PROCESS_STEPS } from "@/lib/process";
import { useInViewList } from "@/hooks/useInViewList";
import { ProcessTimeline } from "@/components/home/process/ProcessTimeline";

export function Process() {
  const { refs, visible } = useInViewList(PROCESS_STEPS.length);

  // wrapper relativo del panel/lista
  const listWrapRef = useRef<HTMLDivElement | null>(null);

  // posiciones reales en px donde pasa la gota (relativas al wrapper)
  const [nodeYsDesktop, setNodeYsDesktop] = useState<number[]>([]);
  const [nodeYsMobile, setNodeYsMobile] = useState<number[]>([]);

  useEffect(() => {
    const wrap = listWrapRef.current;
    if (!wrap) return;

    const measure = () => {
      const wrapRect = wrap.getBoundingClientRect();

      const TOP_3_PX = 12; // top-3
      const NODE_CENTER_ADJUST = 8; // círculo 16px => centro

      const ys = refs.current
        .filter(Boolean)
        .map((li) => {
          const r = (li as HTMLLIElement).getBoundingClientRect();
          return r.top - wrapRect.top + TOP_3_PX + NODE_CENTER_ADJUST;
        });

      setNodeYsDesktop(ys);
      setNodeYsMobile(ys);
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(wrap);

    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [refs]);

  return (
    <section id="process" className="bg-[color:var(--section)] py-16 md:py-20">
      <Container>
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2
            className="font-extrabold tracking-[-0.06em] text-[color:var(--title)]"
            style={{ fontSize: "clamp(44px, 4.4vw, 72px)", lineHeight: "0.95" }}
          >
            Cómo trabajamos
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[color:var(--muted)] md:text-base">
            Un proceso simple, predecible y enfocado en resultados.
          </p>
        </div>

        {/* Panel */}
        <div
          className="
            mx-auto mt-10 max-w-5xl
            rounded-3xl border border-[color:var(--borderSoft)]
            bg-[color:var(--card)]
            px-5 py-6 sm:px-7 sm:py-8 md:px-8
            shadow-[0_18px_55px_rgba(0,0,0,0.06)]
          "
        >
          {/* ✅ Importante: esto define el stacking context */}
          <div ref={listWrapRef} className="relative">
            {/* Timeline Desktop */}
            <div className="hidden sm:block">
              <ProcessTimeline
                nodeYs={nodeYsDesktop}
                leftClassName="left-6"
                topClassName="top-2"
                durationSec={6}
              />
            </div>

            {/* Timeline Mobile */}
            <div className="sm:hidden">
              <ProcessTimeline
                nodeYs={nodeYsMobile}
                leftClassName="left-4"
                topClassName="top-2"
                durationSec={6}
              />
            </div>

            {/* ✅ clave: el UL queda abajo (para que el track no desaparezca) */}
            <ul className="relative z-0 flex flex-col gap-6 sm:gap-7">
              {PROCESS_STEPS.map((step, i) => {
                const num = String(i + 1).padStart(2, "0");
                const isVisible = visible[i];

                return (
                  <li
                    key={step.title}
                    ref={(el) => {
                      refs.current[i] = el;
                    }}
                    data-idx={i}
                    className={[
                      "group relative",
                      "pl-14 sm:pl-16",
                      "transition",
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-3",
                    ].join(" ")}
                    style={{
                      transitionDuration: "600ms",
                      transitionTimingFunction: "cubic-bezier(0.2,0.8,0.2,1)",
                    }}
                  >
                    {/* ✅ Nodo arriba de todo para “pisar” la línea */}
                    <div className="absolute left-4 sm:left-6 top-3 -translate-x-1/2 z-20">
                      <div
                        className="
                          h-4 w-4 rounded-full
                          bg-[color:var(--link)]
                          ring-8 ring-[color:var(--link)]/15
                          transition-transform
                          group-hover:scale-[1.06]
                        "
                      />
                    </div>

                    {/* Contenido */}
                    <div className="rounded-2xl px-4 py-3 sm:px-5 sm:py-4 transition hover:bg-black/[0.02]">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-[15px] sm:text-base font-extrabold tracking-[-0.02em] text-[color:var(--title)]">
                          {step.title}
                        </h3>

                        <span className="hidden sm:inline-flex items-center rounded-full border border-[color:var(--borderSoft)] px-3 py-1 text-[11px] font-semibold text-[color:var(--muted)] transition group-hover:text-[color:var(--title)] group-hover:border-[color:var(--link)]/35">
                          Paso {num}
                        </span>
                      </div>

                      <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">
                        {step.desc}
                      </p>
                    </div>

                    {i !== PROCESS_STEPS.length - 1 && (
                      <div
                        aria-hidden
                        className="ml-0 mt-4 h-px w-full bg-[color:var(--borderSoft)] opacity-70"
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}