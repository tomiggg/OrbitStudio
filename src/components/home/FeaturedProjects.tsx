"use client";

import { Plus_Jakarta_Sans } from "next/font/google";
import { Container } from "@/components/ui/Container";
import { FEATURED_PROJECTS } from "@/lib/projects";
import { ProjectCard } from "@/components/home/projects/ProjectCard";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "800" });

export function FeaturedProjects() {
  return (
    <section id="portfolio" className="relative py-20 md:py-28" style={{ background: "#93ceccff" }}>
      <Container>

        {/* HEADER BLOCK */}
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
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              color: "rgba(0,0,0,0.4)",
              lineHeight: "1.7",
              minWidth: "200px",
            }}
          >
            Trabajo reciente que
            <br />
            habla por sí solo.
          </p>
        </div>

        {/* PROJECT LIST */}
        <div style={{ borderTop: "1px solid rgba(0,0,0,0.12)" }}>
          {FEATURED_PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>


      </Container>
    </section>
  );
}
