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
        <span key={i} className={plusJakarta.className} style={{ color: "rgba(0,0,0,0.75)" }}>
          {p.text}
        </span>
      ) : (
        <span key={i}>{p.text}</span>
      )
    );
}

const TERMINAL_LINES: Record<number, { prefix: string; text: string; color: string }[]> = {
  0: [
    { prefix: "→", text: "analyzing business model...", color: "#0ABAB5" },
    { prefix: " ", text: "✓ friction points detected: 3", color: "rgba(0,0,0,0.4)" },
    { prefix: " ", text: "✓ digital gaps mapped", color: "rgba(0,0,0,0.4)" },
    { prefix: "→", text: "validating solution fit...", color: "#0ABAB5" },
    { prefix: " ", text: "status: AUDITORIA_COMPLETA", color: "rgba(0,0,0,0.4)" },
  ],
  1: [
    { prefix: "→", text: "building brand architecture...", color: "#0ABAB5" },
    { prefix: " ", text: "✓ visual identity: defined", color: "rgba(0,0,0,0.4)" },
    { prefix: " ", text: "✓ design system: ready", color: "rgba(0,0,0,0.4)" },
    { prefix: "→", text: "applying authority layer...", color: "#0ABAB5" },
    { prefix: " ", text: "status: IDENTIDAD_LISTA", color: "rgba(0,0,0,0.4)" },
  ],
  2: [
    { prefix: "→", text: "initializing stack: next.js + python", color: "#0ABAB5" },
    { prefix: " ", text: "✓ architecture: scalable", color: "rgba(0,0,0,0.4)" },
    { prefix: " ", text: "✓ performance: optimized", color: "rgba(0,0,0,0.4)" },
    { prefix: "→", text: "deploying to vercel...", color: "#0ABAB5" },
    { prefix: " ", text: "status: BUILD_SUCCESS", color: "rgba(0,0,0,0.4)" },
  ],
  3: [
    { prefix: "→", text: "transferring ownership...", color: "#0ABAB5" },
    { prefix: " ", text: "✓ codebase: 100% yours", color: "rgba(0,0,0,0.4)" },
    { prefix: " ", text: "✓ docs: delivered", color: "rgba(0,0,0,0.4)" },
    { prefix: "→", text: "sys_status: ACTIVO", color: "#0ABAB5" },
    { prefix: " ", text: "uptime: COMPROMETIDO ●", color: "#0ABAB5" },
  ],
};

const STEP_DURATION = 4000;

export function Process() {
  const [activeStep, setActiveStep] = useState(0);
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [progressWidth, setProgressWidth] = useState(0);

  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const lineTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const activateRef = useRef<(i: number) => void>(null!);

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
    setActiveStep(i);
    setVisibleLines(0);
    setProgressWidth(0);
    startProgress(i);
    lineTimersRef.current.forEach(clearTimeout);
    lineTimersRef.current = [];
    TERMINAL_LINES[i].forEach((_, idx) => {
      const t = setTimeout(() => setVisibleLines(idx + 1), 280 * (idx + 1));
      lineTimersRef.current.push(t);
    });
  }, [startProgress]);

  useEffect(() => {
    activateRef.current = activate;
  }, [activate]);

  useEffect(() => {
    activate(0);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lineTimersRef.current.forEach(clearTimeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="process" className="py-20 md:py-28" style={{ background: "#fff" }}>
      <Container>

        {/* Header */}
        <Reveal>
          <div className="mb-12">
            <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", color: "rgba(0,0,0,0.4)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "16px" }}>
              // CÓMO TRABAJAMOS
            </p>
            <h2
              className={plusJakarta.className}
              style={{ fontSize: "clamp(56px, 8vw, 120px)", color: "#000", lineHeight: "0.85", letterSpacing: "-0.03em", textTransform: "none", paddingBottom: "8px" }}
            >
              proceso.
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.2}>

          {/* TABS */}
          <div style={{ display: "flex", borderTop: "1px solid rgba(0,0,0,0.1)", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
            {PROCESS_STEPS.map((step, i) => {
              const isActive = activeStep === i;
              return (
                <div
                  key={step.title}
                  onClick={() => activate(i)}
                  style={{
                    flex: 1,
                    padding: "18px 20px",
                    cursor: "pointer",
                    position: "relative",
                    borderRight: i < PROCESS_STEPS.length - 1 ? "1px solid rgba(0,0,0,0.08)" : "none",
                    background: isActive ? "#fafafa" : "transparent",
                    transition: "background 0.2s",
                  }}
                >
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "9px", color: "rgba(0,0,0,0.25)", letterSpacing: "0.12em", marginBottom: "4px" }}>
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p
                    className={plusJakarta.className}
                    style={{ fontSize: "13px", color: isActive ? "#000" : "rgba(0,0,0,0.3)", transition: "color 0.2s", letterSpacing: "-0.01em", lineHeight: 1.2, textTransform: "none" }}
                  >
                    {step.title}
                  </p>
                  {isActive && (
                    <div style={{ position: "absolute", bottom: 0, left: 0, height: "2px", background: "#0ABAB5", width: `${progressWidth}%` }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* CONTENT PANEL */}
          <div
            className="grid grid-cols-1 md:grid-cols-2"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.1)", minHeight: "280px" }}
          >

            {/* LEFT — description */}
            <div
              className="md:border-r"
              style={{ padding: "40px 40px 40px 0", borderColor: "rgba(0,0,0,0.08)", position: "relative", overflow: "hidden" }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease }}
                >
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.05, ease }}
                    style={{ fontFamily: "var(--font-body)", fontSize: "9px", color: "#0ABAB5", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "16px" }}
                  >
                    // {PROCESS_STEPS[activeStep].title}
                  </motion.p>
                  <motion.h3
                    className={plusJakarta.className}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.08, ease }}
                    style={{ fontSize: "clamp(24px, 3vw, 36px)", color: "#000", letterSpacing: "-0.03em", lineHeight: 0.95, marginBottom: "20px", textTransform: "none" }}
                  >
                    {PROCESS_STEPS[activeStep].title}
                  </motion.h3>
                  <motion.p
                    className={plusJakartaBody.className}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.12, ease }}
                    style={{ fontSize: "15px", color: "rgba(0,0,0,0.5)", lineHeight: 1.8, maxWidth: "340px" }}
                  >
                    {renderHighlighted(PROCESS_STEPS[activeStep].desc, STEP_HIGHLIGHTS[activeStep])}
                  </motion.p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* RIGHT — Terminal */}
            <div className="hidden md:flex flex-col" style={{ background: "#f0f0ee", height: "100%" }}>
              {/* Terminal bar */}
              <div style={{ background: "rgba(0,0,0,0.03)", borderBottom: "1px solid rgba(0,0,0,0.08)", padding: "10px 16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
                <span style={{ fontFamily: "var(--font-body)", fontSize: "9px", color: "rgba(0,0,0,0.3)", marginLeft: "8px" }}>
                  shift_studio — process.sh
                </span>
              </div>

              {/* Terminal body */}
              <div style={{ padding: "20px", flex: 1, fontFamily: "var(--font-body)", fontSize: "11px", lineHeight: 1.9 }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {TERMINAL_LINES[activeStep].slice(0, visibleLines).map((line, i) => {
                      const isLast = i === visibleLines - 1;
                      return (
                        <div key={i} style={{ display: "flex", gap: "8px" }}>
                          <span style={{ color: line.color, flexShrink: 0 }}>{line.prefix}</span>
                          <span style={{ color: line.color }}>
                            {line.text}
                            {isLast && (
                              <span style={{ display: "inline-block", width: "7px", height: "12px", background: "#0ABAB5", marginLeft: "3px", verticalAlign: "middle", animation: "blink 1s step-end infinite" }} />
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
                <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
              </div>

              {/* Terminal footer */}
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", padding: "12px 20px", fontFamily: "var(--font-body)", fontSize: "9px", color: "rgba(0,0,0,0.3)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                SHIFT_STUDIO · CÓRDOBA_AR · NEXT.JS + PYTHON
              </div>
            </div>

          </div>

        </Reveal>
      </Container>
    </section>
  );
}
