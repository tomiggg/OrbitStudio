"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { PROCESS_STEPS } from "@/lib/process";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "800" });
const plusJakartaBody = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "500" });
const ease = [0.22, 1, 0.36, 1] as const;

const ink = "#0d0d0d";
const mute = "#7a7a7a";
const rule = "#dcdcd6";
const teal = "#0ABAB5";
const skyDeep = "#5fa3b8";

const STEP_HIGHLIGHTS: string[][] = [
  ["fugas de eficiencia", "problema real"],
  ["núcleo visual", "autoridad", "lógica de negocio"],
  ["motor operativo", "alto rendimiento", "escalabilidad"],
  ["activo digital soberano", "sin fricciones técnicas"],
];

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
        <span key={i} style={{ color: skyDeep, fontWeight: 600 }}>{p.text}</span>
      ) : (
        <span key={i}>{p.text}</span>
      )
    );
}

const STEP_DURATION = 4000;

export function Process() {
  const [activeStep, setActiveStep] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);

  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const activateRef = useRef<(i: number) => void>(null!);
  const activeStepRef = useRef(0);

  const startProgress = useCallback((step: number) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startTimeRef.current = performance.now();
    const tick = (now: number) => {
      const elapsed = now - (startTimeRef.current ?? now);
      const pct = Math.min(100, (elapsed / STEP_DURATION) * 100);
      setProgressWidth(pct);
      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        activateRef.current((step + 1) % PROCESS_STEPS.length);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const activate = useCallback((i: number) => {
    activeStepRef.current = i;
    setActiveStep(i);
    setProgressWidth(0);
    startProgress(i);
  }, [startProgress]);

  // Hover: pausa el auto-advance y abre ese step
  const handleRowMouseEnter = useCallback((i: number) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    activeStepRef.current = i;
    setActiveStep(i);
    setProgressWidth(0);
  }, []);

  // Mouse sale del bloque: reanuda desde el step actual
  const handleSectionMouseLeave = useCallback(() => {
    const step = activeStepRef.current >= 0 ? activeStepRef.current : 0;
    startProgress(step);
  }, [startProgress]);

  // Click: toggle — cierra si ya está abierto, abre si está cerrado
  const handleClick = useCallback((i: number) => {
    if (activeStepRef.current === i && activeStep === i) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      activeStepRef.current = -1;
      setActiveStep(-1);
      setProgressWidth(0);
    } else {
      activate(i);
    }
  }, [activeStep, activate]);

  useEffect(() => { activateRef.current = activate; }, [activate]);

  useEffect(() => {
    activate(0);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="process" className="relative py-8 md:py-12" style={{ background: "#f0f0ee" }}>
      <Container>

        {/* Heading */}
        <Reveal>
          <div className="mb-14">
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
              {"// CÓMO TRABAJAMOS"}
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
              proceso.
            </h2>
          </div>
        </Reveal>

        {/* Accordion rows */}
        <Reveal delay={0.15}>
          <div style={{ borderTop: `1px solid ${rule}` }} onMouseLeave={handleSectionMouseLeave}>
            {PROCESS_STEPS.map((step, i) => {
              const isActive = activeStep === i;
              return (
                <div key={step.title} style={{ borderBottom: `1px solid ${rule}`, position: "relative" }}>

                  {/* Progress bar */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      height: "1px",
                      background: ink,
                      width: isActive ? `${progressWidth}%` : "0%",
                      zIndex: 1,
                    }}
                  />

                  {/* Row header */}
                  <div
                    role="button"
                    tabIndex={0}
                    onMouseEnter={() => handleRowMouseEnter(i)}
                    onClick={() => handleClick(i)}
                    onKeyDown={(e) => e.key === "Enter" && handleClick(i)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                      padding: "clamp(14px, 2vw, 24px) 0",
                      cursor: "pointer",
                    }}
                  >
                    {/* Giant number — left */}
                    <motion.span
                      className={plusJakarta.className}
                      style={{
                        fontSize: "clamp(48px, 7vw, 100px)",
                        letterSpacing: "-0.05em",
                        lineHeight: 0.82,
                        flexShrink: 0,
                        textTransform: "none",
                        width: "clamp(100px, 14vw, 180px)",
                      }}
                      animate={{ color: isActive ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.06)" }}
                      transition={{ duration: 0.25 }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </motion.span>

                    {/* Title */}
                    <motion.span
                      className={`${plusJakarta.className} flex-1`}
                      style={{
                        fontSize: "clamp(28px, 4vw, 56px)",
                        letterSpacing: "-0.035em",
                        lineHeight: 0.92,
                        display: "block",
                        textTransform: "none",
                      }}
                      animate={{ color: isActive ? ink : mute }}
                      transition={{ duration: 0.25 }}
                    >
                      {step.title}
                    </motion.span>

                  </div>

                  {/* Expanded content */}
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        key="expand"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease }}
                        style={{ overflow: "hidden" }}
                      >
                        <div
                          style={{
                            paddingBottom: "clamp(20px, 2.5vw, 32px)",
                            paddingLeft: "clamp(108px, 15vw, 200px)",
                          }}
                        >
                          <motion.p
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: 0.05, ease }}
                            className={plusJakartaBody.className}
                            style={{
                              fontSize: "clamp(14px, 1.4vw, 17px)",
                              color: "#444",
                              lineHeight: 1.55,
                              maxWidth: "480px",
                              margin: 0,
                            }}
                          >
                            {renderHighlighted(step.desc, STEP_HIGHLIGHTS[i])}
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
