"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { useContact } from "@/components/contact/ContactProvider";
import { Anton } from "next/font/google";

const anton = Anton({ subsets: ["latin"], weight: "400" });

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  heroTag?: string;
  externalUrl?: string;
  blocks: {
    label: string;
    content: React.ReactNode;
  }[];
  highlights?: {
    title: string;
    items: string[];
  };
};

const ease = [0.22, 1, 0.36, 1] as const;

export function CaseLayout({
  eyebrow = "Caso real",
  title,
  subtitle,
  heroTag,
  externalUrl,
  blocks,
  highlights,
}: Props) {
  const { openContact } = useContact();

  return (
    <section
      className="relative overflow-hidden py-16 md:py-24"
      style={{ backgroundColor: "#a7e9e75f" }} // Fondo menta suave
    >
      <Container>
        {/* Hero Compacto y Alto */}
        <div className="mx-auto max-w-4xl text-center mb-12 md:mb-16">
          <div className="font-mono text-[9px] font-bold tracking-[0.2em] text-[#0abab5] uppercase mb-4 opacity-80">
            {eyebrow} {heroTag && <span className="mx-1 opacity-30">·</span>} {heroTag}
          </div>

          <h1
            className={`${anton.className} block uppercase text-black mb-6`}
            style={{
              fontSize: "clamp(48px, 9vw, 92px)", // Título masivo como en la imagen
              lineHeight: "0.85",
              letterSpacing: "-0.04em",
            }}
          >
            {title}
          </h1>

          {subtitle && (
            <p className="mx-auto max-w-xl text-[14px] md:text-[16px] leading-relaxed text-[#072b2a] opacity-60 mb-10 font-medium">
              {subtitle}
            </p>
          )}

          {/* Botones Estilo Foto */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {externalUrl && (
              <a
                href={externalUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-black px-8 py-3.5 font-mono text-[10px] font-bold tracking-[0.15em] text-white uppercase transition hover:bg-[#072b2a]"
              >
                [ VER PROYECTO LIVE ]
              </a>
            )}
            <button
              className="border border-black/20 bg-white/50 px-8 py-3.5 font-mono text-[10px] font-bold tracking-[0.15em] text-black uppercase transition hover:border-black/40"
            >
              [ VER DETALLE ]
            </button>
          </div>
        </div>

        {/* GRID 50/50 - Bloques Apilados y Altos */}
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2 md:gap-6 items-stretch">
          
          {/* Columna Izquierda: Contexto y Problema */}
          <div className="flex flex-col gap-4">
            {blocks.slice(0, 2).map((b, i) => (
              <article
                key={b.label}
                className="bg-white p-10 md:p-14 shadow-sm flex flex-col justify-start min-h-[280px]"
              >
                <h4 className="mb-6 font-mono text-[10px] font-bold tracking-[0.2em] text-[#0abab5] uppercase">
                  {b.label}
                </h4>
                <div className="text-[15px] md:text-[17px] leading-relaxed text-[#072b2a]/90 font-medium">
                  {b.content}
                </div>
              </article>
            ))}
          </div>

          {/* Columna Derecha: Resultados y CTA */}
          <div className="flex flex-col gap-4">
            {highlights && (
              <aside className="bg-white p-10 md:p-14 shadow-sm min-h-[280px]">
                <h4 className="mb-6 font-mono text-[10px] font-bold tracking-[0.2em] text-[#0abab5] uppercase">
                  {highlights.title}
                </h4>
                <ul className="flex flex-col gap-4">
                  {highlights.items.map((it) => (
                    <li key={it} className="flex gap-4 text-[14px] md:text-[16px] leading-relaxed text-[#072b2a]/80">
                      <span className="text-[#0abab5] font-bold text-[18px]">✓</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </aside>
            )}

            {/* Caja de Contacto Oscura Matcheando Altura */}
            <div 
              className="p-10 md:p-14 shadow-sm flex flex-col justify-center bg-[#072b2a] flex-grow min-h-[280px]"
              style={{ backgroundColor: "rgba(7, 43, 42, 0.95)" }} // Color oscuro Shift Studio
            >
              <h4 className="mb-4 font-mono text-[10px] font-bold tracking-[0.2em] text-[#0abab5] uppercase">
                ¿Problema parecido?
              </h4>
              <p className="mb-8 text-[14px] md:text-[15px] leading-relaxed text-white/70">
                Analizamos tu caso y damos un rango estimado, sin compromiso.
              </p>
              <button
                onClick={openContact}
                className="w-full bg-[#0abab5] py-4 font-mono text-[11px] font-bold tracking-[0.15em] text-white uppercase transition hover:brightness-110"
              >
                [ HABLEMOS ]
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}