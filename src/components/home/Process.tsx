"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { PROCESS_STEPS } from "@/lib/process";
import { useInViewList } from "@/hooks/useInViewList";
import { ProcessTimeline } from "./process/ProcessTimeline";
import { Anton } from "next/font/google";

const anton = Anton({ subsets: ["latin"], weight: "400" });

export function Process() {
  const { refs, visible } = useInViewList(PROCESS_STEPS.length);
  const listWrapRef = useRef<HTMLDivElement | null>(null);
  const [nodeYs, setNodeYs] = useState<number[]>([]);

  useEffect(() => {
    const measure = () => {
      const wrap = listWrapRef.current;
      if (!wrap) return;
      const wrapRect = wrap.getBoundingClientRect();
      const ys = refs.current
        .filter(Boolean)
        .map((li) => {
          const r = (li as HTMLLIElement).getBoundingClientRect();
          // Alineado al centro del título del paso
          return r.top - wrapRect.top + 16; 
        });
      setNodeYs(ys);
    };

    const timer = setTimeout(measure, 150);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", measure);
    };
  }, [refs]);

  return (
    <section 
      id="process" 
      className="py-16 md:py-32"
      style={{ backgroundColor: "#a7e9e75f" }}
    >
      <Container>
        {/* Header Estilo Brutalista */}
        <div className="mx-auto max-w-4xl text-center mb-20 md:mb-28">
          <h2
            className={`${anton.className} text-black uppercase`}
            style={{ 
              fontSize: "clamp(48px, 6vw, 84px)", 
              lineHeight: "0.9",
              letterSpacing: "-0.03em"
            }}
          >
            Cómo trabajamos
          </h2>
          <p className="mx-auto mt-6 max-w-xl font-mono text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-[#0abab5] uppercase">
            [ Proceso simple · Predecible · Orientado a resultados ]
          </p>
        </div>

        {/* El Contenedor ahora es una estructura limpia sin bordes redondeados exagerados */}
        <div className="mx-auto max-w-4xl relative">
          <div ref={listWrapRef} className="relative">
            
            {/* Timeline Pro */}
            <ProcessTimeline nodeYs={nodeYs} leftClassName="left-4 sm:left-8" durationSec={5} />

            <ul className="relative z-20 flex flex-col gap-12 md:gap-16">
              {PROCESS_STEPS.map((step, i) => {
                const num = String(i + 1).padStart(2, "0");

                return (
                  <li
                    key={step.title}
                    ref={(el) => { if(el) refs.current[i] = el; }}
                    className="group relative pl-12 sm:pl-24"
                  >
                    {/* Punto de anclaje (Nodo) */}
                    <div className="absolute left-4 sm:left-8 top-4 -translate-x-1/2 z-30">
                      <div className="h-4 w-4 bg-black border-2 border-[#0abab5] transition-transform group-hover:rotate-45 duration-500" />
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex items-baseline gap-4">
                        <span className="font-mono text-[14px] font-black text-[#0abab5] opacity-40">
                          {num}
                        </span>
                        <h3 
                          className={`${anton.className} text-black uppercase leading-none`}
                          style={{ fontSize: "clamp(26px, 3vw, 40px)", letterSpacing: "-0.02em" }}
                        >
                          {step.title}
                        </h3>
                      </div>

                      <div className="max-w-2xl">
                        <p className="text-[14px] md:text-[16px] leading-relaxed text-[#072b2a]/70 font-medium">
                          {step.desc}
                        </p>
                      </div>
                      
                      {/* Línea decorativa técnica */}
                      <div className="mt-4 h-[1px] w-full bg-black/5" />
                    </div>
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