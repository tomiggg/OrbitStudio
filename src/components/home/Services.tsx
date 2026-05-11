"use client";

import { Container } from "@/components/ui/Container";
import { SERVICES } from "@/lib/services";
import { ServiceCard } from "./services/ServiceCard";
import { Anton } from "next/font/google"; // Importamos la fuente

const font = Anton({ subsets: ["latin"], weight: "400" });

export function Services() {
  return (
    <section
      id="services"
      className="relative overflow-hidden py-16 md:py-24"
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
        <div className="flex flex-col justify-center">
          
          {/* Header Centrado */}
          <div className="mx-auto max-w-3xl text-center mb-16">
            {/* Título: Usando Anton, negro full y tracking apretado */}
            <h2
              className={`${font.className} inline-block text-black uppercase`}
              style={{
                fontSize: "clamp(48px, 6vw, 84px)", // Un poco más grande para lucir la Anton
                lineHeight: "0.9",
                letterSpacing: "-0.04em", // Tracking-tighter para ese look brutalista
              }}
            >
              NUESTROS SERVICIOS
            </h2>
            
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-[#072b2a] md:text-base font-medium">
              Infraestructura digital diseñada para resolver problemas reales de negocio.
            </p>
          </div>

          {/* GRID */}
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-3 md:gap-8 items-stretch">
            {SERVICES.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} />
            ))}
          </div>

        </div>
      </Container>
    </section>
  );
}