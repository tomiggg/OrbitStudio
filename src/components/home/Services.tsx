"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SERVICES } from "@/lib/services";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "800" });
const plusJakartaBody = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "400" });
const ease = [0.22, 1, 0.36, 1] as const;

const ink = "#0d0d0d";
const sky = "#9EC7D4";
const skyDeep = "#5fa3b8";
const mute = "#7a7a7a";
const rule = "#dcdcd6";

function renderHighlighted(text: string, highlights: string[]) {
  let parts: { text: string; bold: boolean }[] = [{ text, bold: false }];
  for (const word of highlights) {
    parts = parts.flatMap((part) => {
      if (part.bold) return [part];
      const segments = part.text.split(word);
      return segments.flatMap((seg, i) => [
        { text: seg, bold: false },
        ...(i < segments.length - 1 ? [{ text: word, bold: true }] : []),
      ]);
    });
  }
  return parts
    .filter((p) => p.text !== "")
    .map((p, i) =>
      p.bold ? (
        <span key={i} style={{ color: skyDeep, fontWeight: 600 }}>
          {p.text}
        </span>
      ) : (
        <span key={i}>{p.text}</span>
      )
    );
}

type ServicesProps = { onOpenContact?: (serviceTitle?: string) => void };

export function Services({ onOpenContact: _ }: ServicesProps = {}) {
  const [active, setActive] = useState(0);

  return (
    <section id="services" className="relative py-8 md:py-12" style={{ background: "#f0f0ee" }}>
      <Container>

        {/* HEADER */}
        <Reveal>
          <div className="mb-14">
            <p
              className="mb-4 uppercase"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                color: mute,
                letterSpacing: "0.22em",
              }}
            >
              {"// LO QUE OFRECEMOS"}
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
              servicios.
            </h2>
          </div>
        </Reveal>

        {/* SERVICE ROWS */}
        <Reveal delay={0.15}>
          <div style={{ borderTop: `1px solid ${rule}` }}>
            {SERVICES.map((service, i) => {
              const isActive = active === i;
              return (
                <div
                  key={service.id}
                  style={{ borderBottom: `1px solid ${rule}` }}
                >
                  {/* Row header */}
                  <div
                    role="button"
                    tabIndex={0}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => setActive(isActive ? -1 : i)}
                    onKeyDown={(e) => e.key === "Enter" && setActive(isActive ? -1 : i)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                      padding: "clamp(14px, 2vw, 24px) 0",
                      cursor: "pointer",
                    }}
                  >
                    {/* Title */}
                    <motion.span
                      className={`${plusJakarta.className} flex-1`}
                      style={{
                        fontSize: "clamp(28px, 4vw, 56px)",
                        letterSpacing: "-0.035em",
                        lineHeight: 0.92,
                        display: "block",
                      }}
                      animate={{ color: isActive ? ink : mute }}
                      transition={{ duration: 0.25 }}
                    >
                      {service.title}
                    </motion.span>

                    {/* Giant number — right */}
                    <motion.span
                      className={`hidden md:block ${plusJakarta.className}`}
                      style={{
                        fontSize: "clamp(48px, 7vw, 100px)",
                        letterSpacing: "-0.05em",
                        lineHeight: 0.82,
                        flexShrink: 0,
                        textTransform: "none",
                      }}
                      animate={{ color: isActive ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.06)" }}
                      transition={{ duration: 0.25 }}
                    >
                      {service.number}
                    </motion.span>
                  </div>

                  {/* Expand */}
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        key="expand"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.38, ease }}
                        style={{ overflow: "hidden" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-end",
                            gap: "40px",
                            paddingBottom: "clamp(20px, 2.5vw, 32px)",
                            paddingLeft: "52px",
                          }}
                        >
                          <motion.p
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.05, ease }}
                            className={plusJakartaBody.className}
                            style={{
                              fontSize: "clamp(14px, 1.4vw, 17px)",
                              color: "#444",
                              lineHeight: 1.55,
                              maxWidth: "480px",
                              margin: 0,
                            }}
                          >
                            {renderHighlighted(service.description, service.highlights)}
                          </motion.p>

                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.12, ease }}
                            className="hidden md:block"
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "11px",
                              color: sky,
                              letterSpacing: "0.22em",
                              textTransform: "uppercase",
                              textAlign: "right",
                              margin: 0,
                              flexShrink: 0,
                            }}
                          >
                            {service.model}
                          </motion.p>
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
