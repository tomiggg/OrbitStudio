"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { FEATURED_PROJECTS } from "@/lib/projects";
import { ProjectCard } from "@/components/home/projects/ProjectCard";
import { useEffect, useMemo, useState } from "react";
import { Anton } from "next/font/google";

const anton = Anton({ subsets: ["latin"], weight: "400" });

function TypeLine({
  words,
  className = "",
  speed = 22,
  pauseMs = 900,
}: {
  words: string[];
  className?: string;
  speed?: number;
  pauseMs?: number;
}) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [dir, setDir] = useState<"type" | "erase">("type");
  const current = words[idx] ?? "";

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (prefersReduced) { setText(current); return; }

    let t: number | undefined;
    if (dir === "type") {
      if (text.length < current.length) {
        t = window.setTimeout(() => setText(current.slice(0, text.length + 1)), speed);
      } else {
        t = window.setTimeout(() => setDir("erase"), pauseMs);
      }
    } else {
      if (text.length > 0) {
        t = window.setTimeout(() => setText((p) => p.slice(0, -1)), Math.max(10, speed - 6));
      } else {
        setIdx((v) => (v + 1) % words.length);
        setDir("type");
      }
    }
    return () => { if (t) window.clearTimeout(t); };
  }, [text, dir, idx, current, words, speed, pauseMs]);

  return (
    <div className={className} aria-label={current}>
      <span>{text}</span>
      {text.length < current.length && text.length > 0 && (
        <span className="animate-pulse ml-0.5">_</span>
      )}
    </div>
  );
}

export function FeaturedProjects() {
  const typedPhrases = useMemo(() => [
    "Landing que convierte visitas en consultas.",
    "Web profesional con identidad y confianza.",
    "Web app para operar más rápido.",
    "Ecommerce listo para escalar ventas.",
    "Rediseño + performance + SEO técnico.",
  ], []);

  return (
    <section
      id="portfolio"
      className="relative overflow-hidden py-16 md:min-h-[100svh] md:py-20"
      style={{ backgroundColor: "#a7e9e75f" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
        style={{ background: "linear-gradient(to bottom, rgba(7,43,42,0.08), rgba(7,43,42,0))" }}
      />

      <Container>
        <div className="md:flex md:min-h-[calc(100svh-160px)] md:flex-col md:justify-center">

          {/* Header */}
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2
              className={`${anton.className} inline-block text-black uppercase`}
              style={{
                fontSize: "clamp(48px, 6vw, 84px)",
                lineHeight: "0.9",
                letterSpacing: "-0.04em",
              }}
            >
              PROYECTOS DESTACADOS
            </h2>

            <div className="mx-auto mt-6 max-w-2xl">
              <p className="text-sm leading-relaxed text-[#072b2a]/70 md:text-base font-medium">
                Muestras cortas de lo que construimos para clientes reales.
              </p>
              <div className="mt-3 inline-flex items-center justify-center gap-2">
                <span className="font-mono text-[11px] font-bold tracking-[0.12em] text-[#072b2a]/50 uppercase">
                  # EJEMPLO:
                </span>
                <TypeLine
                  words={typedPhrases}
                  className="font-mono text-[11px] font-bold tracking-[0.08em] text-[#0ABAB5] uppercase"
                  speed={22}
                  pauseMs={900}
                />
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="mx-auto mt-4 grid w-full max-w-5xl gap-6 md:grid-cols-2 md:gap-8">
            {FEATURED_PROJECTS.map((p, i) => (
              <ProjectCard key={p.id} project={p as any} index={i} />
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 text-center">
            <Link
              href="/proyectos"
              className="group inline-flex items-center gap-3 font-mono text-[10px] font-bold tracking-[0.15em] text-[#072b2a]/60 uppercase transition hover:text-[#072b2a]"
            >
              [ VER TODOS LOS PROYECTOS ]
              <span className="h-[1px] w-6 bg-[#072b2a]/25 transition-all group-hover:w-10 group-hover:bg-[#0ABAB5]" />
            </Link>
          </div>

        </div>
      </Container>
    </section>
  );
}