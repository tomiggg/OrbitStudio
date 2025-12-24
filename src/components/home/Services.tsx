"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { SERVICES } from "@/lib/services";
import type { Service } from "@/lib/services";

import { ServicesCarousel } from "@/components/home/services/ServicesCarousel";
import { ServiceDetails } from "@/components/home/services/ServiceDetails";

type ServicesProps = {
  onOpenContact: (serviceTitle?: string) => void;
};

export function Services({ onOpenContact }: ServicesProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo<Service | null>(
    () => SERVICES.find((s) => s.id === selectedId) ?? null,
    [selectedId]
  );

  return (
    <section
      id="services"
      className="relative overflow-hidden py-16 md:py-20"
      style={{ backgroundColor: "#a7e9e7ff" }}
    >
      {/* Separación suave desde hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
        style={{
          background:
            "linear-gradient(to bottom, rgba(7,43,42,0.08), rgba(7,43,42,0))",
        }}
      />

      <div aria-hidden className="pointer-events-none absolute inset-0 services-noise" />

      <Container>
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2
            className="font-extrabold tracking-[-0.06em] text-[#072b2a]"
            style={{ fontSize: "clamp(44px, 4.4vw, 72px)", lineHeight: "0.95" }}
          >
            Servicios diseñados para negocio
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#072b2a]/70 md:text-base">
            Elegí un punto de partida. Después lo iteramos según tus objetivos.
          </p>
        </div>

        {/* Carrusel */}
        <div className="mt-12">
          <ServicesCarousel
            services={SERVICES}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>

        {/* Detalle modular */}
        {selected && (
          <ServiceDetails
            service={selected}
            onClose={() => setSelectedId(null)}
            onChoose={(title) => onOpenContact(title)}
          />
        )}
      </Container>

      <style jsx>{`
        .services-noise {
          opacity: 0.06;
          mix-blend-mode: overlay;
          background-image: repeating-linear-gradient(
              0deg,
              rgba(255, 255, 255, 0.07) 0px,
              rgba(255, 255, 255, 0.07) 1px,
              transparent 1px,
              transparent 3px
            ),
            repeating-linear-gradient(
              90deg,
              rgba(0, 0, 0, 0.04) 0px,
              rgba(0, 0, 0, 0.04) 1px,
              transparent 1px,
              transparent 4px
            );
        }
      `}</style>
    </section>
  );
}