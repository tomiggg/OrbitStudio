"use client";

import { useMemo, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

type Extra = { name: string; price: string };

type Service = {
  id: string;
  title: string;
  priceFrom: string;
  idealFor: string;
  highlights: string[];
  mockupSrc: string; // ruta en /public
  includes: string[];
  extras: Extra[];
};

const SERVICES: Service[] = [
  {
    id: "landing",
    title: "Landing Page Profesional",
    priceFrom: "USD 150",
    idealFor: "Emprendedores y validación de ideas.",
    highlights: ["Landing responsive", "Diseño moderno", "CTA + SEO básico"],
    mockupSrc: "/mockups/landing.jpg",
    includes: [
      "Landing responsive (1 página)",
      "Diseño moderno",
      "Copy básico optimizado",
      "CTA a WhatsApp o formulario",
      "Optimización básica SEO",
    ],
    extras: [
      { name: "Sección extra", price: "+USD 30" },
      { name: "Formulario avanzado", price: "+USD 40" },
      { name: "Calendly / reservas", price: "+USD 60" },
    ],
  },
  {
    id: "website",
    title: "Sitio Web Profesional",
    priceFrom: "USD 350",
    idealFor: "Pymes y profesionales.",
    highlights: ["Multi-sección", "Diseño a medida", "WhatsApp + SEO básico"],
    mockupSrc: "/mockups/website.jpg",
    includes: [
      "Home + secciones (Servicios, Contacto, etc.)",
      "Diseño a medida",
      "Copy optimizado",
      "Responsive",
      "SEO básico",
      "Integración WhatsApp",
    ],
    extras: [
      { name: "Blog", price: "+USD 120" },
      { name: "Multilenguaje", price: "+USD 150" },
      { name: "Optimización SEO avanzada", price: "+USD 180" },
    ],
  },
  {
    id: "ecommerce",
    title: "E-commerce",
    priceFrom: "USD 800",
    idealFor: "Negocios que quieren vender online.",
    highlights: ["Catálogo + carrito", "Pagos integrados", "Panel de gestión"],
    mockupSrc: "/mockups/ecommerce.jpg",
    includes: [
      "Catálogo de productos",
      "Carrito de compras",
      "Pasarela de pago",
      "Panel de gestión",
      "Diseño personalizado",
      "Configuración inicial",
    ],
    extras: [
      { name: "Carga inicial de productos", price: "+USD 80" },
      { name: "Envíos / logística", price: "+USD 150" },
      { name: "Emails transaccionales", price: "+USD 120" },
    ],
  },
  {
    id: "webapps",
    title: "Web Apps / Sistemas",
    priceFrom: "USD 1.200",
    idealFor: "Empresas con procesos internos.",
    highlights: ["A medida", "Escalable", "Integraciones + seguridad"],
    mockupSrc: "/mockups/webapp.jpg",
    includes: [
      "Desarrollo a medida",
      "Arquitectura escalable",
      "Integraciones necesarias",
      "Seguridad y performance base",
    ],
    extras: [
      { name: "Dashboard avanzado", price: "+USD 250" },
      { name: "Roles/Permisos", price: "+USD 220" },
      { name: "Automatizaciones", price: "+USD 250" },
    ],
  },
];

export function Services() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(
    () => SERVICES.find((s) => s.id === selectedId) ?? null,
    [selectedId]
  );

  const railRef = useRef<HTMLDivElement | null>(null);

  function scrollByCards(dir: "left" | "right") {
    const el = railRef.current;
    if (!el) return;

    // Scroll “por una card” aprox (responsive)
    const amount = Math.min(420, Math.max(280, Math.floor(el.clientWidth * 0.85)));
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  }

  return (
    <section id="services" className="bg-[color:var(--section)] py-16 md:py-20">
      <Container>
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--title)] md:text-3xl">
            Servicios diseñados para negocio
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[color:var(--muted)] md:text-base">
            Elegí un punto de partida. Después lo iteramos según tus objetivos.
          </p>
        </div>

        {/* Carrusel */}
        <div className="relative mt-12">
          {/* Fade edges (sugiere scroll) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[color:var(--section)] to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[color:var(--section)] to-transparent"
          />

          {/* Flechas (desktop) */}
          <div className="hidden md:block">
            <button
              type="button"
              onClick={() => scrollByCards("left")}
              className="absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-xl border border-[color:var(--borderSoft)] bg-[color:var(--card)] px-3 py-2 text-sm font-semibold text-[color:var(--title)] shadow-[0_6px_18px_rgba(0,0,0,0.08)] hover:bg-[color:var(--bg)]"
              aria-label="Anterior"
            >
              ←
            </button>

            <button
              type="button"
              onClick={() => scrollByCards("right")}
              className="absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-xl border border-[color:var(--borderSoft)] bg-[color:var(--card)] px-3 py-2 text-sm font-semibold text-[color:var(--title)] shadow-[0_6px_18px_rgba(0,0,0,0.08)] hover:bg-[color:var(--bg)]"
              aria-label="Siguiente"
            >
              →
            </button>
          </div>

          <div
            ref={railRef}
            className="
              flex gap-6 overflow-x-auto pb-4
              px-1 sm:px-2 md:px-0
              snap-x snap-mandatory
              scroll-smooth
              [-ms-overflow-style:none]
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {SERVICES.map((s) => {
              const isActive = s.id === selectedId;

              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedId(s.id)}
                  className={`
                    snap-start
                    w-[86vw] sm:w-[360px] md:w-[360px]
                    flex-none
                    rounded-2xl border
                    bg-[color:var(--card)]
                    px-6 py-6 text-left
                    transition
                    shadow-[0_1px_2px_rgba(0,0,0,0.04)]
                    hover:-translate-y-0.5
                    hover:shadow-[0_10px_28px_rgba(0,0,0,0.08)]
                    focus:outline-none focus:ring-2 focus:ring-[color:var(--ringSoft)]
                    ${
                      isActive
                        ? "border-[color:var(--cta)]"
                        : "border-[color:var(--borderSoft)] hover:border-[color:var(--ringSoft)]"
                    }
                  `}
                >
                  <h3 className="text-lg font-semibold text-[color:var(--title)]">
                    {s.title}
                  </h3>

                  <div className="mt-2 text-sm font-semibold text-[color:var(--title)]">
                    Desde {s.priceFrom}
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted)]">
                    <span className="font-semibold text-[color:var(--title)]">
                      Ideal para:
                    </span>{" "}
                    {s.idealFor}
                  </p>

                  <ul className="mt-4 space-y-2 text-sm text-[color:var(--muted)]">
                    {s.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--cta)]" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 border-t border-[color:var(--borderSoft)] pt-4">
                    <span className="text-sm font-semibold text-[color:var(--link)]">
                      Ver detalles →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detalle inline */}
        {selected && (
          <div className="mx-auto mt-10 max-w-5xl rounded-2xl border border-[color:var(--borderSoft)] bg-[color:var(--card)] px-5 py-6 md:px-7 md:py-7">
            <div className="grid gap-8 md:grid-cols-[1fr_260px] md:items-start">
              {/* INFO */}
              <div>
                <div className="text-sm font-semibold text-[color:var(--title)]">
                  {selected.title}{" "}
                  <span className="font-normal text-[color:var(--muted)]">
                    · desde {selected.priceFrom}
                  </span>
                </div>

                <div className="mt-5 grid gap-6 md:grid-cols-2">
                  {/* Incluye */}
                  <div>
                    <div className="text-sm font-semibold text-[color:var(--title)]">
                      Incluye
                    </div>
                    <ul className="mt-3 space-y-2 text-sm text-[color:var(--muted)]">
                      {selected.includes.map((x) => (
                        <li key={x} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--cta)]" />
                          <span>{x}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Extras */}
                  <div>
                    <div className="text-sm font-semibold text-[color:var(--title)]">
                      Extras opcionales
                    </div>
                    <ul className="mt-3 space-y-2 text-sm text-[color:var(--muted)]">
                      {selected.extras.map((e) => (
                        <li
                          key={e.name}
                          className="flex items-start justify-between gap-4"
                        >
                          <span>{e.name}</span>
                          <span className="shrink-0 font-semibold text-[color:var(--title)]">
                            {e.price}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* MOCKUP */}
              <div className="flex justify-center md:justify-end">
                <div className="w-[210px] md:w-[230px]">
                  <div className="overflow-hidden rounded-2xl border border-[color:var(--borderSoft)] bg-[color:var(--section)] p-2">
                    <div className="aspect-[9/16] w-full overflow-hidden rounded-xl bg-[color:var(--bg)]">
                      <img
                        src={selected.mockupSrc}
                        alt={`Mockup ${selected.title}`}
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  </div>


                </div>
              </div>
            </div>

            {/* ACCIONES */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="inline-flex items-center justify-center rounded-xl border border-[color:var(--borderSoft)] px-5 py-3 text-sm font-semibold text-[color:var(--title)] hover:bg-[color:var(--section)]"
              >
                Cerrar
              </button>

              <ButtonLink href="#contact" size="md" className="!text-white">
                Elegir este servicio
              </ButtonLink>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}