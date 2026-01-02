import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PROJECTS } from "@/lib/projects";

export default function ProyectosPage() {
  return (
    <section className="py-16 md:py-20 bg-[color:var(--section)]">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h1
            className="font-extrabold tracking-[-0.06em] text-[color:var(--title)]"
            style={{ fontSize: "clamp(44px, 4.4vw, 72px)", lineHeight: "0.95" }}
          >
            Proyectos
          </h1>
          <p className="mt-4 text-sm md:text-base text-[color:var(--muted)]">
            Casos cortos: problema → enfoque → solución → resultado.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 md:gap-8">
          {PROJECTS.map((p) => (
            <Link
              key={p.id}
              href={`/proyectos/${p.id}`}
              className="
                group rounded-2xl border border-[color:var(--borderSoft)]
                bg-[color:var(--card)]
                p-6 md:p-7
                shadow-[0_16px_45px_rgba(0,0,0,0.08)]
                transition hover:-translate-y-1 hover:shadow-[0_28px_78px_rgba(0,0,0,0.14)]
                no-underline
              "
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-lg font-extrabold tracking-[-0.03em] text-[color:var(--title)]">
                  {p.title}
                </h2>

                {p.serviceTag ? (
                  <span className="rounded-full border border-[color:var(--borderSoft)] px-3 py-1 text-[11px] font-semibold text-[color:var(--muted)]">
                    {p.serviceTag}
                  </span>
                ) : null}
              </div>

              <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted)]">
                {p.description}
              </p>

              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--title)]/70 group-hover:text-[color:var(--title)]">
                Ver caso
                <span className="h-[1px] w-6 bg-[color:var(--title)]/25 transition-all group-hover:w-10 group-hover:bg-[color:var(--link)]" />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}