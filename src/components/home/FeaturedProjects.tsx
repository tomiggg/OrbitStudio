"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { FEATURED_PROJECTS } from "@/lib/projects";
import { ProjectCard } from "@/components/home/projects/ProjectCard";
import { useEffect, useMemo, useState } from "react";

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

    if (prefersReduced) {
      setText(current);
      return;
    }

    let t: number | undefined;

    if (dir === "type") {
      if (text.length < current.length) {
        t = window.setTimeout(() => {
          setText(current.slice(0, text.length + 1));
        }, speed);
      } else {
        t = window.setTimeout(() => setDir("erase"), pauseMs);
      }
    } else {
      if (text.length > 0) {
        t = window.setTimeout(() => {
          setText((prev) => prev.slice(0, -1));
        }, Math.max(10, speed - 6));
      } else {
        setIdx((v) => (v + 1) % words.length);
        setDir("type");
      }
    }

    return () => {
      if (t) window.clearTimeout(t);
    };
  }, [text, dir, idx, current, words, speed, pauseMs]);

  return (
    <div className={className} aria-label={current}>
      <span>{text}</span>
      <span className="caret" aria-hidden>
        ▍
      </span>

      <style jsx>{`
        .caret {
          display: inline-block;
          transform: translateY(-1px);
          margin-left: 2px;
          opacity: 0.9;
          animation: blink 1.05s steps(1, end) infinite;
        }
        @keyframes blink {
          0%,
          49% {
            opacity: 1;
          }
          50%,
          100% {
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .caret {
            display: none;
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

export function FeaturedProjects() {
  const typedPhrases = useMemo(
    () => [
      "Landing que convierte visitas en consultas.",
      "Web profesional con identidad y confianza.",
      "Web app para operar más rápido.",
      "Ecommerce listo para escalar ventas.",
      "Rediseño + performance + SEO técnico.",
    ],
    []
  );

  return (
    <section
      id="portfolio"
      className="relative overflow-hidden py-16 md:min-h-[100svh] md:py-20"
      style={{ backgroundColor: "#a7e9e75f" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
        style={{
          background:
            "linear-gradient(to bottom, rgba(7,43,42,0.08), rgba(7,43,42,0))",
        }}
      />

      <Container>
        <div className="md:flex md:min-h-[calc(100svh-160px)] md:flex-col md:justify-center">
          <div className="mx-auto max-w-3xl text-center">
            <h2
              className="font-extrabold tracking-[-0.06em] text-[#072b2a]"
              style={{
                fontSize: "clamp(44px, 4.4vw, 72px)",
                lineHeight: "0.95",
              }}
            >
              Proyectos destacados
            </h2>

            {/* ✅ copy “real” + ✅ tipeo marcado */}
            <div className="mx-auto mt-4 max-w-2xl">
              <p className="text-sm leading-relaxed text-[#072b2a]/70 md:text-base">
                Muestras cortas de lo que construimos para clientes (y del tipo de
                resultados que buscamos):
              </p>

              <div className="mt-3 inline-flex items-center justify-center gap-2">
                <span className="text-sm font-semibold text-[#072b2a]/80">
                  Ejemplos:
                </span>

                <TypeLine
                  words={typedPhrases}
                  className="text-sm font-semibold text-[#0ABAB5]"
                  speed={22}
                  pauseMs={900}
                />
              </div>


            </div>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 md:gap-8">
            {FEATURED_PROJECTS.map((p, i) => (
              <ProjectCard key={p.id} project={p as any} index={i} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/proyectos"
              className={[
                "group inline-flex items-center gap-2",
                "text-sm font-semibold",
                "text-[#072b2a]/70 transition",
                "hover:text-[#072b2a]",
              ].join(" ")}
            >
              Ver todos los proyectos
              <span
                aria-hidden="true"
                className="h-[1px] w-6 bg-[#072b2a]/25 transition-all group-hover:w-10 group-hover:bg-[#0ABAB5]"
              />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}