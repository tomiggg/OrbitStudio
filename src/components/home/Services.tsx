"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus_Jakarta_Sans } from "next/font/google";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SERVICES, type Service } from "@/lib/services";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "800" });
const plusJakartaBody = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "500" });
const ease = [0.22, 1, 0.36, 1] as const;

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
        <span key={i} className={plusJakarta.className} style={{ color: "rgba(0,0,0,0.85)" }}>
          {p.text}
        </span>
      ) : (
        <span key={i}>{p.text}</span>
      )
    );
}

function ServiceAvatar({ service, size }: { service: Service; size: number }) {
  const radius = size <= 60 ? "10px" : "16px";
  const padding = size <= 60 ? "2px" : "4px";
  const tiffany = "rgba(0,0,0,0.04)";

  if (service.image) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          background: tiffany,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          padding,
        }}
      >
        <Image
          src={service.image}
          alt={service.title}
          width={size}
          height={size}
          style={{ objectFit: "contain", width: "100%", height: "100%" }}
        />
      </div>
    );
  }
  // Placeholder until real image is provided
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: tiffany,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {service.emoji ? (
        <span style={{ fontSize: size <= 60 ? "22px" : "34px", lineHeight: 1 }}>
          {service.emoji}
        </span>
      ) : (
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: size <= 60 ? "10px" : "16px",
            color: "#0ABAB5",
            letterSpacing: "0.08em",
          }}
        >
          {service.number}
        </span>
      )}
    </div>
  );
}

type ServicesProps = { onOpenContact?: (serviceTitle?: string) => void };

export function Services({ onOpenContact: _ }: ServicesProps = {}) {
  const [active, setActive] = useState(0);
  // Mobile accordion: -1 = all closed, 0-2 = open index
  const [mobileOpen, setMobileOpen] = useState(0);

  return (
    <section id="services" className="relative py-8 md:py-12" style={{ background: "#fff" }}>
      <Container>

        {/* HEADER */}
        <Reveal>
          <div className="mb-12">
            <p
              className="mb-4 uppercase"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "9px",
                color: "rgba(0,0,0,0.4)",
                letterSpacing: "0.18em",
              }}
            >
              {"// LO QUE OFRECEMOS"}
            </p>
            <h2
              className={plusJakarta.className}
              style={{
                fontSize: "clamp(56px, 8vw, 120px)",
                color: "#000",
                lineHeight: "0.85",
                textTransform: "none",
                letterSpacing: "-0.03em",
              }}
            >
              servicios.
            </h2>
          </div>
        </Reveal>

        {/* ── MOBILE: accordion ── */}
        <Reveal delay={0.15}>
          <div
            className="md:hidden"
            style={{ borderTop: "1px solid rgba(0,0,0,0.1)" }}
          >
            {SERVICES.map((service, i) => {
              const isOpen = mobileOpen === i;
              return (
                <div
                  key={service.id}
                  style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}
                >
                  {/* Row */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setMobileOpen(isOpen ? -1 : i)}
                    onKeyDown={(e) => e.key === "Enter" && setMobileOpen(isOpen ? -1 : i)}
                    className="flex items-center"
                    style={{ padding: "24px 0", gap: "16px", cursor: "pointer" }}
                  >
                    <ServiceAvatar service={service} size={56} />
                    <span
                      className={`${plusJakarta.className} flex-1`}
                      style={{
                        fontSize: "26px",
                        color: isOpen ? "#000" : "rgba(0,0,0,0.45)",
                        letterSpacing: "-0.02em",
                        transition: "color 0.2s",
                      }}
                    >
                      {service.title}
                    </span>
                    <svg
                      width="16" height="16" viewBox="0 0 16 16" fill="none"
                      stroke={isOpen ? "#0ABAB5" : "rgba(0,0,0,0.25)"}
                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                      style={{
                        flexShrink: 0,
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s ease, stroke 0.2s",
                      }}
                    >
                      <polyline points="3 6 8 11 13 6" />
                    </svg>
                  </div>

                  {/* Expandable body */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease }}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={{ padding: "0 0 28px 40px" }}>
                          <p
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "9px",
                              color: "#0ABAB5",
                              letterSpacing: "0.18em",
                              textTransform: "uppercase",
                              marginBottom: "12px",
                            }}
                          >
                            {"// "}{service.category}
                          </p>
                          <p
                            className={plusJakartaBody.className}
                            style={{
                              fontSize: "15px",
                              color: "rgba(0,0,0,0.5)",
                              lineHeight: "1.8",
                              maxWidth: "340px",
                              margin: 0,
                            }}
                          >
                            {renderHighlighted(service.description, service.highlights)}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* ── DESKTOP: master-detail split ── */}
        <Reveal delay={0.15}>
          <div
            className="hidden md:flex"
            style={{
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >

            {/* LEFT — service list */}
            <div
              className="w-2/5"
              style={{ borderRight: "1px solid rgba(0,0,0,0.1)" }}
            >
              {SERVICES.map((service, i) => {
                const isActive = active === i;
                return (
                  <div
                    key={service.id}
                    role="button"
                    tabIndex={0}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => setActive(i)}
                    onKeyDown={(e) => e.key === "Enter" && setActive(i)}
                    style={{
                      padding: "20px 24px 20px 20px",
                      borderBottom: "1px solid rgba(0,0,0,0.1)",
                      cursor: "pointer",
                      position: "relative",
                    }}
                  >
                    {/* Active left border */}
                    <motion.div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: "2px",
                        background: "#0ABAB5",
                        originY: 0,
                      }}
                      animate={{ height: isActive ? "100%" : "0%" }}
                      transition={{ duration: 0.35, ease }}
                    />

                    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "10px" }}>
                      <ServiceAvatar service={service} size={52} />
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "9px",
                          color: "#0ABAB5",
                          letterSpacing: "0.14em",
                        }}
                      >
                        {service.number}
                      </span>
                    </div>
                    <motion.span
                      className={plusJakarta.className}
                      style={{
                        fontSize: "clamp(18px, 2vw, 26px)",
                        letterSpacing: "-0.02em",
                        display: "block",
                      }}
                      animate={{ color: isActive ? "#000" : "rgba(0,0,0,0.3)" }}
                      transition={{ duration: 0.25 }}
                    >
                      {service.title}
                    </motion.span>
                  </div>
                );
              })}
            </div>

            {/* RIGHT — content panel */}
            <div
              className="w-3/5"
              style={{
                padding: "28px 0 28px 40px",
                position: "relative",
                overflow: "hidden",
                minHeight: "220px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {/* Watermark number */}
              <AnimatePresence mode="wait">
                <motion.span
                  key={`wm-${active}`}
                  className={plusJakarta.className}
                  style={{
                    position: "absolute",
                    right: "-12px",
                    bottom: "-32px",
                    fontSize: "clamp(160px, 22vw, 260px)",
                    color: "rgba(13,13,13,0.07)",
                    lineHeight: 1,
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {SERVICES[active].number}
                </motion.span>
              </AnimatePresence>

              {/* Active content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease }}
                >
                  {/* Category */}
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.05, ease }}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "9px",
                      color: "#0ABAB5",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      marginBottom: "16px",
                    }}
                  >
                    {"// "}{SERVICES[active].category}
                  </motion.p>

                  {/* Title — character stagger with controlled line break */}
                  <h3
                    className={plusJakarta.className}
                    style={{
                      fontSize: "clamp(32px, 4.5vw, 60px)",
                      color: "#000",
                      lineHeight: "0.92",
                      letterSpacing: "-0.03em",
                      textTransform: "none",
                      marginBottom: "28px",
                    }}
                  >
                    {(() => {
                      const title = SERVICES[active].title;
                      const lines = title.includes(" & ")
                        ? [title.split(" & ")[0] + " &", title.split(" & ")[1]]
                        : [title.split(" ").slice(0, -1).join(" "), title.split(" ").slice(-1)[0]];
                      const chars = lines.flatMap((line, li) => [
                        ...line.split(""),
                        ...(li < lines.length - 1 ? ["\n"] : []),
                      ]);
                      return chars.map((char, i) =>
                        char === "\n" ? (
                          <br key={`br-${i}`} />
                        ) : (
                          <motion.span
                            key={`${active}-${i}`}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.28, delay: 0.08 + i * 0.022, ease }}
                            style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : "normal" }}
                          >
                            {char}
                          </motion.span>
                        )
                      );
                    })()}
                  </h3>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.38, ease }}
                    className={plusJakartaBody.className}
                    style={{
                      fontSize: "17px",
                      color: "rgba(0,0,0,0.5)",
                      lineHeight: "1.75",
                      maxWidth: "400px",
                      margin: 0,
                    }}
                  >
                    {renderHighlighted(SERVICES[active].description, SERVICES[active].highlights)}
                  </motion.p>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </Reveal>

      </Container>
    </section>
  );
}
