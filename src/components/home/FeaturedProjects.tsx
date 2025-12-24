"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { FEATURED_PROJECTS } from "@/lib/projects";

export function FeaturedProjects() {
  return (
    <section
      id="portfolio"
      className="relative overflow-hidden py-16 md:py-20"
      style={{ backgroundColor: "#a7e9e75f" }} // mismo bg que Services
    >
      {/* separacion suave (igual criterio que Services) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
        style={{
          background:
            "linear-gradient(to bottom, rgba(7,43,42,0.08), rgba(7,43,42,0))",
        }}
      />

      <Container>
        {/* Header (MISMO estilo que Services) */}
        <div className="mx-auto max-w-3xl text-center">
          <h2
            className="font-extrabold tracking-[-0.06em] text-[#072b2a]"
            style={{ fontSize: "clamp(44px, 4.4vw, 72px)", lineHeight: "0.95" }}
          >
            Proyectos destacados
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#072b2a]/70 md:text-base">
            Dos ejemplos reales como prueba social (sin convertir la Home en portfolio).
          </p>
        </div>

        {/* Cards (blancas, limpias, como venimos haciendo) */}
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
          {FEATURED_PROJECTS.map((p) => (
          <article
            key={p.id}
            className="
              group relative
              flex flex-col justify-between
              rounded-2xl
              bg-white
              px-6 py-7
              shadow-[0_10px_30px_rgba(0,0,0,0.08)]
              transition
              hover:-translate-y-0.5
              hover:shadow-[0_18px_45px_rgba(0,0,0,0.12)]
            "
          >
            {/* Top */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-extrabold tracking-[-0.03em] text-[#072b2a]">
                  {p.title}
                </h3>

                {p.serviceTag && (
                  <span
                    className="
                      inline-flex items-center
                      rounded-full
                      bg-[#0abab5]/10
                      px-3 py-1
                      text-[11px] font-semibold
                      text-[#072b2a]
                      whitespace-nowrap
                    "
                  >
                    {p.serviceTag}
                  </span>
                )}
              </div>

              <p className="mt-3 text-sm leading-relaxed text-[#072b2a]/70">
                {p.description}
              </p>
            </div>

            {/* Footer */}
            <div className="mt-6">
              <a
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="
                  inline-flex items-center gap-2
                  text-sm font-semibold
                  text-[#0abab5]
                  transition
                  group-hover:text-[#089e9a]
                "
              >
                {p.hrefLabel ?? "Ver proyecto"}
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  &rarr;
                </span>
              </a>
            </div>
          </article>
          ))}
        </div>

        {/* bottom link */}
        <div className="mt-8 text-center">
          <Link
            href="/proyectos"
            className="
              group inline-flex items-center gap-2
              text-sm font-semibold
              text-[#072b2a]/70
              transition
              hover:text-[#072b2a]
            "
          >
            Ver todos los proyectos
            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5"
            >
              &rarr;
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}