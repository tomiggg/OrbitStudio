"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { SERVICES } from "@/lib/services";
import type { Service } from "@/lib/services";
import { ServicesCarousel } from "@/components/home/services/ServicesCarousel";
import { ServiceDetails } from "@/components/home/services/ServiceDetails";
import { motion } from "framer-motion";

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
      className="relative overflow-hidden min-h-[100svh] py-20 md:py-24"
      style={{ backgroundColor: "#a7e9e7ff" }}
    >
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
        <div className="flex min-h-[calc(100svh-140px)] flex-col justify-center">
          {/* Header */}
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2
              className="font-extrabold tracking-[-0.06em] text-[#072b2a]"
              style={{ fontSize: "clamp(44px, 4.4vw, 72px)", lineHeight: "0.95" }}
            >
              Servicios diseñados para negocio
            </h2>

            <motion.p
              className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#072b2a]/70 md:text-base"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              Elegí un punto de partida. Después lo iteramos según tus objetivos.
            </motion.p>
          </motion.div>

          {/* Grid */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <ServicesCarousel
              services={SERVICES}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </motion.div>
        </div>

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