"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Container } from "@/components/ui/Container";
import { PROCESS_STEPS } from "@/lib/process";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "800" });

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

const ease = [0.22, 1, 0.36, 1] as const;

export function Process() {
  const [activeStep, setActiveStep] = useState(0);
  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    setVisibleLines(0);
    const lines = TERMINAL_LINES[activeStep];
    lines.forEach((_, i) => {
      setTimeout(() => setVisibleLines(i + 1), 300 * (i + 1));
    });
  }, [activeStep]);

  const lines = TERMINAL_LINES[activeStep];

  return (
    <section id="process" className="py-20 md:py-28" style={{ background: "#2A2A27" }}>
      <Container>

        {/* Header */}
        <div className="mb-12">
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "9px",
              color: "#0ABAB5",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            // CÓMO TRABAJAMOS
          </p>
          <h2
            className={plusJakarta.className}
            style={{
              fontSize: "clamp(56px, 8vw, 120px)",
              color: "#fff",
              lineHeight: "0.85",
              letterSpacing: "-0.03em",
              textTransform: "none",
              paddingBottom: "8px",
            }}
          >
            proceso.
          </h2>
        </div>

        {/* Two-col panel */}
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", overflow: "hidden", background: "#363633" }}
        >

          {/* LEFT — Timeline */}
          <div
            className="md:border-r"
            style={{
              padding: "32px",
              borderColor: "rgba(255,255,255,0.07)",
            }}
          >
            {PROCESS_STEPS.map((step, i) => {
              const isActive = activeStep === i;
              const isLast = i === PROCESS_STEPS.length - 1;

              return (
                <div
                  key={step.title}
                  onClick={() => setActiveStep(i)}
                  style={{ display: "flex", gap: "16px", position: "relative", cursor: "pointer" }}
                >
                  {/* Node + line */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        border: `1px solid ${isActive ? "#0ABAB5" : "rgba(255,255,255,0.2)"}`,
                        background: isActive ? "#0ABAB5" : "transparent",
                        flexShrink: 0,
                        marginTop: "2px",
                        transition: "all 0.3s",
                      }}
                    />
                    {!isLast && (
                      <div
                        style={{
                          width: "1px",
                          flex: 1,
                          minHeight: "40px",
                          background: isActive ? "rgba(10,186,181,0.4)" : "rgba(255,255,255,0.08)",
                          transition: "background 0.3s",
                          margin: "4px 0",
                        }}
                      />
                    )}
                  </div>

                  {/* Step content */}
                  <div style={{ paddingBottom: isLast ? "0" : "8px", flex: 1 }}>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "9px",
                        color: "rgba(255,255,255,0.2)",
                        letterSpacing: "0.12em",
                        marginBottom: "4px",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <p
                      className={plusJakarta.className}
                      style={{
                        fontSize: "15px",
                        color: isActive ? "#fff" : "rgba(255,255,255,0.4)",
                        transition: "color 0.2s",
                        marginBottom: "4px",
                        textTransform: "none",
                      }}
                    >
                      {step.title}
                    </p>
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          key={i}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease }}
                          style={{ overflow: "hidden" }}
                        >
                          <p
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "11px",
                              color: "rgba(255,255,255,0.4)",
                              lineHeight: 1.7,
                              maxWidth: "260px",
                              paddingBottom: "16px",
                            }}
                          >
                            {step.desc}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT — Terminal (desktop only) */}
          <div
            className="hidden md:flex flex-col"
            style={{ background: "#1C1C1A", height: "100%" }}
          >
            {/* Terminal bar */}
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "9px",
                  color: "rgba(255,255,255,0.2)",
                  marginLeft: "8px",
                }}
              >
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
                  {lines.slice(0, visibleLines).map((line, i) => {
                    const isLast = i === visibleLines - 1;
                    return (
                      <div key={i} style={{ display: "flex", gap: "8px" }}>
                        <span style={{ color: line.color, flexShrink: 0 }}>{line.prefix}</span>
                        <span style={{ color: line.color }}>
                          {line.text}
                          {isLast && (
                            <span
                              style={{
                                display: "inline-block",
                                width: "7px",
                                height: "12px",
                                background: "#0ABAB5",
                                marginLeft: "3px",
                                verticalAlign: "middle",
                                animation: "blink 1s step-end infinite",
                              }}
                            />
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
            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.07)",
                padding: "12px 20px",
                fontFamily: "var(--font-body)",
                fontSize: "9px",
                color: "rgba(255,255,255,0.2)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              SHIFT_STUDIO · CÓRDOBA_AR · NEXT.JS + PYTHON
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
