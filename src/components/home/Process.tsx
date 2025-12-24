"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";

const STEPS = [
  {
    title: "Diagnóstico",
    desc: "Entendemos tu negocio, tu público y el objetivo real del sitio.",
  },
  {
    title: "Estrategia",
    desc: "Definimos estructura, mensajes y CTA para convertir con claridad.",
  },
  {
    title: "Construcción",
    desc: "Diseño + desarrollo por iteraciones cortas, con feedback y orden.",
  },
  {
    title: "Entrega & escalado",
    desc: "Publicación + base lista para crecer: mejoras, automatizaciones y nuevas secciones.",
  },
];

function useInViewList(count: number) {
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  const [visible, setVisible] = useState<boolean[]>(Array(count).fill(false));

  useEffect(() => {
    const els = refs.current.filter(Boolean) as HTMLLIElement[];
    const io = new IntersectionObserver(
      (entries) => {
        setVisible((prev) => {
          const next = [...prev];
          for (const e of entries) {
            const idx = Number((e.target as HTMLElement).dataset.idx);
            if (e.isIntersecting) next[idx] = true;
          }
          return next;
        });
      },
      { threshold: 0.15 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return { refs, visible };
}

export function Process() {
  const { refs, visible } = useInViewList(STEPS.length);

  return (
    <section id="process" className="bg-[color:var(--section)] py-16 md:py-20">
      <Container>
        {/* Header */}
{/* Header (igual estándar que Servicios) */}
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

        {/* Big panel */}
        <div
          className="
            mx-auto mt-10 max-w-5xl
            rounded-3xl border border-[color:var(--borderSoft)]
            bg-[color:var(--card)]
            px-5 py-6 sm:px-7 sm:py-8 md:px-8
            shadow-[0_18px_55px_rgba(0,0,0,0.06)]
          "
        >
          <div className="relative">
            {/* timeline line (left) */}
            <div
              aria-hidden="true"
              className="
                absolute left-6 top-2 bottom-2
                hidden sm:block
                w-[3px] rounded-full
                bg-[color:var(--link)]/40
              "
            />

            {/* Mobile line */}
            <div
              aria-hidden="true"
              className="
                absolute left-4 top-2 bottom-2
                sm:hidden
                w-[3px] rounded-full
                bg-[color:var(--link)]/35
              "
            />

            <ul className="flex flex-col gap-6 sm:gap-7">
{STEPS.map((s, i) => {
  const num = String(i + 1).padStart(2, "0");
  const isVisible = visible[i];

  return (
    <li
      key={s.title}
      ref={(el) => {
        refs.current[i] = el;
      }}
      data-idx={i}
      className={[
        "group relative",
        "pl-14 sm:pl-16",
        "transition",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
      ].join(" ")}
      style={{
        transitionDuration: "600ms",
        transitionTimingFunction: "cubic-bezier(0.2,0.8,0.2,1)",
      }}
    >
      {/* node */}
      <div className="absolute left-6 top-3 -translate-x-1/2">
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

      {/* content block */}
      <div
        className="
          rounded-2xl
          px-4 py-3 sm:px-5 sm:py-4
          transition
          hover:bg-black/[0.02]
        "
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] sm:text-base font-extrabold tracking-[-0.02em] text-[color:var(--title)]">
            {s.title}
          </h3>

          {/* badge a la derecha (único número que queda) */}
          <span
            className="
              hidden sm:inline-flex
              items-center rounded-full
              border border-[color:var(--borderSoft)]
              px-3 py-1
              text-[11px] font-semibold
              text-[color:var(--muted)]
              transition
              group-hover:text-[color:var(--title)]
              group-hover:border-[color:var(--link)]/35
            "
          >
            Paso {num}
          </span>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">
          {s.desc}
        </p>
      </div>

      {i !== STEPS.length - 1 && (
        <div
          aria-hidden="true"
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