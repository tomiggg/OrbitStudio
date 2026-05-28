"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "800" });
const plusJakartaBody = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "400" });
const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"] });

const ink = "#0d0d0d";
const mute = "#7a7a7a";
const sky = "#9EC7D4";
const paper = "#FAFCFC";
const ease = [0.22, 1, 0.36, 1] as const;

const PROJECTS_DATA = [
  {
    id: "proyecto-03",
    name: "Próximamente",
    tag: "EN CAMINO",
    title: "",
    desc: "",
    href: "#",
    bg: "#e8e8e3",
    tc: ink,
    iconBg: "#d4d4ce",
    iconColor: "#a0a09a",
    btnBg: "#d4d4ce",
    btnColor: "#a0a09a",
    linkBg: ink,
    linkColor: "#e8e8e3",
    icon: "?",
    border: "none",
    comingSoon: true,
  },
  {
    id: "tu-utn",
    name: "Tu UTN",
    tag: "OPTIMIZACIÓN DE PROCESOS",
    title: "Caos de datos → control total.",
    desc: "Sistema académico complejo y antiguo transformado en una herramienta simple. Diseño centrado en decisiones rápidas.",
    href: "/proyectos/tu-utn",
    bg: paper,
    tc: ink,
    iconBg: ink,
    iconColor: sky,
    btnBg: ink,
    btnColor: sky,
    linkBg: ink,
    linkColor: paper,
    icon: "U",
    border: "1px solid #dcdcd6",
    comingSoon: false,
  },
  {
    id: "pb-inmobiliaria",
    name: "PB Inmobiliaria",
    tag: "SITIO WEB + ADMIN",
    title: "Web + panel de propiedades.",
    desc: "Sin presencia formal ni forma de actualizar el catálogo. Creamos web y panel admin para publicar, editar y captar consultas.",
    href: "/proyectos/pb-inmobiliaria",
    bg: ink,
    tc: paper,
    iconBg: sky,
    iconColor: ink,
    btnBg: sky,
    btnColor: ink,
    linkBg: sky,
    linkColor: ink,
    icon: "PB",
    border: "none",
    comingSoon: false,
  },
];

export function FeaturedProjects() {
  const [activeIndex, setActiveIndex] = useState<number>(2);

  return (
    <section id="portfolio" className="bg-[#f0f0ee] min-h-screen py-16 px-4 md:px-9 overflow-hidden">
      <Container>

        {/* HEADING */}
        <Reveal>
          <div className="pt-12 pb-9">
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                color: mute,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              {"// TRABAJO RECIENTE"}
            </p>
            <h2
              className={plusJakarta.className}
              style={{
                fontSize: "clamp(56px, 8vw, 120px)",
                color: ink,
                lineHeight: "0.86",
                letterSpacing: "-0.04em",
                textTransform: "none",
                margin: 0,
              }}
            >
              proyectos.
            </h2>
          </div>
        </Reveal>

        {/* STACK */}
        <Reveal delay={0.12}>
          <div
            className="flex flex-col w-full max-w-[840px] mx-auto mt-8"
            style={{ gap: 0 }}
          >
            {PROJECTS_DATA.map((p, i) => {
              const isExpanded = i === activeIndex;

              return (
                <div
                  key={p.id}
                  onClick={() => setActiveIndex(i)}
                  className="rounded-[24px] overflow-hidden relative"
                  style={{
                    background: p.bg,
                    border: p.border !== "none" ? p.border : undefined,
                    zIndex: i + 1,
                    marginBottom: i === PROJECTS_DATA.length - 1 ? 0 : -24,
                    cursor: "pointer",
                    transition: "box-shadow 0.3s ease",
                  }}
                >
                  {/* CARD HEADER */}
                  <div
                    className="flex items-center justify-between px-6 md:px-8 relative z-10"
                    style={{ height: 72 }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={plusJakarta.className}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 13,
                          fontWeight: 800,
                          flexShrink: 0,
                          background: p.iconBg,
                          color: p.iconColor,
                        }}
                      >
                        {p.icon}
                      </div>
                      <span
                        className={plusJakarta.className}
                        style={{
                          fontSize: 16,
                          fontWeight: 800,
                          letterSpacing: "-0.01em",
                          color: p.tc,
                          opacity: p.comingSoon ? 0.45 : 1,
                        }}
                      >
                        {p.name}
                      </span>
                    </div>

                    <motion.div
                      animate={{ rotate: isExpanded ? 45 : 0 }}
                      transition={{ duration: 0.3, ease }}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                        fontWeight: 700,
                        flexShrink: 0,
                        background: p.btnBg,
                        color: p.btnColor,
                        lineHeight: 1,
                      }}
                    >
                      +
                    </motion.div>
                  </div>

                  {/* CARD BODY — Framer Motion para animación real de altura */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        key="body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease }}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={{ paddingLeft: 32, paddingRight: 32, paddingBottom: 36 }}>
                          {p.comingSoon ? (
                            /* --- COMING SOON --- */
                            <div
                              style={{
                                borderTop: "1px solid rgba(0,0,0,0.07)",
                                paddingTop: 24,
                                display: "flex",
                                flexDirection: "column",
                                gap: 12,
                              }}
                            >
                              <p
                                className={jetBrainsMono.className}
                                style={{
                                  fontSize: 10,
                                  letterSpacing: "0.22em",
                                  textTransform: "uppercase",
                                  color: "#b0b0aa",
                                  margin: 0,
                                }}
                              >
                                {/* EN CONSTRUCCIÓN */}
                              </p>
                              <p
                                className={plusJakarta.className}
                                style={{
                                  fontSize: "clamp(22px, 3vw, 32px)",
                                  fontWeight: 800,
                                  letterSpacing: "-0.03em",
                                  lineHeight: 1.05,
                                  color: "#c8c8c2",
                                  margin: 0,
                                }}
                              >
                                Nuevo proyecto en camino.
                              </p>
                              <p
                                className={plusJakartaBody.className}
                                style={{
                                  fontSize: 13,
                                  lineHeight: 1.65,
                                  color: "#b0b0aa",
                                  maxWidth: 340,
                                  margin: 0,
                                }}
                              >
                                Identidad, plataforma y lanzamiento digital. Revelación próxima.
                              </p>
                            </div>
                          ) : (
                            /* --- PROJECT CONTENT --- */
                            <div
                              className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-6 md:gap-12"
                              style={{
                                borderTop: `1px solid ${p.tc === ink ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)"}`,
                                paddingTop: 24,
                              }}
                            >
                              {/* Left */}
                              <div>
                                <div
                                  className={jetBrainsMono.className}
                                  style={{
                                    fontSize: 10,
                                    letterSpacing: "0.18em",
                                    textTransform: "uppercase",
                                    opacity: 0.5,
                                    marginBottom: 12,
                                    color: p.tc,
                                  }}
                                >
                                  {p.tag}
                                </div>
                                <div
                                  className={plusJakarta.className}
                                  style={{
                                    fontSize: "clamp(24px, 3.5vw, 36px)",
                                    fontWeight: 800,
                                    letterSpacing: "-0.03em",
                                    lineHeight: 1.05,
                                    color: p.tc,
                                  }}
                                >
                                  {p.title}
                                </div>
                              </div>

                              {/* Right */}
                              <div className="flex flex-col justify-between items-start gap-6 md:pt-1">
                                <p
                                  className={plusJakartaBody.className}
                                  style={{
                                    fontSize: 14,
                                    lineHeight: 1.6,
                                    opacity: 0.7,
                                    color: p.tc,
                                    margin: 0,
                                  }}
                                >
                                  {p.desc}
                                </p>
                                <a
                                  href={p.href}
                                  onClick={(e) => e.stopPropagation()}
                                  className={`${jetBrainsMono.className} inline-flex items-center gap-2 no-underline`}
                                  style={{
                                    fontSize: 10,
                                    letterSpacing: "0.15em",
                                    textTransform: "uppercase",
                                    padding: "12px 24px",
                                    borderRadius: 9999,
                                    background: p.linkBg,
                                    color: p.linkColor,
                                    transition: "opacity 0.2s",
                                  }}
                                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
                                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                                >
                                  Ver proyecto →
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Reveal>

      </Container>
    </section>
  );
}
