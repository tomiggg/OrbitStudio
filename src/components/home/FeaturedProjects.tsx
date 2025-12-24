"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { FEATURED_PROJECTS } from "@/lib/projects";

export function FeaturedProjects() {
  return (
    <section id="portfolio" className="bg-[color:var(--bg)] py-16 md:py-20">
      <Container>
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--title)] md:text-3xl">
            Proyectos destacados
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[color:var(--muted)] md:text-base">
            Dos ejemplos reales como prueba social (sin convertir la Home en portfolio).
          </p>
        </div>

        {/* Cards */}
        <div className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-2">
          {FEATURED_PROJECTS.map((p) => (
            <article
              key={p.id}
              className="
                group relative
                rounded-3xl border border-[color:var(--borderSoft)]
                bg-[color:var(--card)]
                p-6 md:p-7
                shadow-[0_1px_2px_rgba(0,0,0,0.04)]
                transition
                hover:-translate-y-0.5
                hover:shadow-[0_14px_40px_rgba(0,0,0,0.08)]
              "
            >
              {/* top row */}
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-base font-semibold text-[color:var(--title)] md:text-[15px]">
                  {p.title}
                </h3>

                {p.serviceTag && (
                  <span
                    className="
                      inline-flex items-center
                      rounded-full
                      border border-[color:var(--borderSoft)]
                      bg-[color:var(--section)]
                      px-3 py-1
                      text-[11px] font-semibold
                      text-[color:var(--title)]
                      whitespace-nowrap
                    "
                    title="Tipo de servicio"
                  >
                    {p.serviceTag}
                  </span>
                )}
              </div>

              {/* description */}
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">
                {p.description}
              </p>

              {/* footer link */}
              <div className="mt-5">
                <a
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    inline-flex items-center gap-2
                    text-sm font-semibold
                    text-[color:var(--link)]
                    transition
                    hover:text-[color:var(--linkHover)]
                  "
                >
                  {p.hrefLabel ?? "Ver proyecto"}
                  <span
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </a>
              </div>

              {/* subtle accent */}
              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute inset-0 rounded-3xl
                  ring-1 ring-transparent
                  group-hover:ring-[color:var(--ringSoft)]
                  transition
                "
              />
            </article>
          ))}
        </div>

        {/* bottom link */}
        <div className="mt-8 text-center">
          <Link
            href="/proyectos"
            className="
              inline-flex items-center gap-2
              text-sm font-semibold
              text-[color:var(--muted)]
              transition
              hover:text-[color:var(--title)]
            "
          >
            Ver todos los proyectos
            <span aria-hidden="true" className="transition-transform hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}