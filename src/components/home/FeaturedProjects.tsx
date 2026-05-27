"use client";

import { useEffect, useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { FEATURED_PROJECTS } from "@/lib/projects";
import { ProjectCard } from "@/components/home/projects/ProjectCard";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "800" });

const TYPING_TEXT = "// TRABAJO RECIENTE\nQUE HABLA POR SÍ SOLO.";
const CHAR_DELAY = 48;
const PAUSE_MS = 2400;

function useTypewriter(text: string, charDelay: number, pauseMs: number) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const done = index >= text.length;
    const delay = done ? pauseMs : charDelay;
    const t = setTimeout(() => setIndex(done ? 0 : index + 1), delay);
    return () => clearTimeout(t);
  }, [index, text, charDelay, pauseMs]);

  return text.slice(0, index);
}

export function FeaturedProjects() {
  const typed = useTypewriter(TYPING_TEXT, CHAR_DELAY, PAUSE_MS);
  const typing = typed.length < TYPING_TEXT.length;

  return (
    <section id="portfolio" className="relative py-12 md:py-16" style={{ background: "#93ceccff", borderRadius: "24px", margin: "0 8px" }}>
      <Container>

        {/* HEADER BLOCK */}
        <Reveal>
          <div className="relative w-full mb-16">

            {/* Section label */}
            <p
              className="mb-5 uppercase"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "9px",
                color: "rgba(0,0,0,0.5)",
                letterSpacing: "0.18em",
              }}
            >
              // TRABAJO RECIENTE
            </p>

            <h2
              className={plusJakarta.className}
              style={{
                fontSize: "clamp(56px, 8vw, 120px)",
                color: "#000",
                lineHeight: "0.85",
                textTransform: "none",
                letterSpacing: "-0.03em",
                paddingBottom: "24px",
              }}
            >
              proyectos.
            </h2>

            <p
              className="hidden md:block absolute right-0 text-right"
              style={{
                top: "50%",
                transform: "translateY(-50%)",
                fontFamily: "monospace",
                fontSize: "9px",
                color: "rgba(0,0,0,0.35)",
                letterSpacing: "0.18em",
                lineHeight: "2",
                whiteSpace: "pre-line",
              }}
            >
              {typed}
              <span
                style={{
                  display: "inline-block",
                  width: "1px",
                  height: "0.85em",
                  background: "rgba(0,0,0,0.3)",
                  marginLeft: "2px",
                  verticalAlign: "middle",
                  animation: typing ? "none" : "cursorBlink 0.8s step-end infinite",
                  opacity: typing ? 1 : undefined,
                }}
              />
            </p>
          </div>
        </Reveal>

        {/* PROJECT LIST */}
        <Reveal delay={0.15}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "16px",
            }}
          >
            {FEATURED_PROJECTS.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </Reveal>


      </Container>
    </section>
  );
}
