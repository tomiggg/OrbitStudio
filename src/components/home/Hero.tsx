"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "800" });

const GRAIN_FPS = 30;
const GRAIN_TILE = 256;
const GRAIN_PX = 2;
const ease = [0.22, 1, 0.36, 1] as const;

type HeroProps = { onOpenContact?: () => void };

export function Hero({ onOpenContact: _ }: HeroProps) {
  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 600], [0, -80]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, []);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const tile = document.createElement("canvas");
    tile.width = GRAIN_TILE;
    tile.height = GRAIN_TILE;
    const tCtx = tile.getContext("2d");
    if (!tCtx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    let animId: number;
    let last = 0;
    const interval = 1000 / GRAIN_FPS;

    function drawGrain(ts: number) {
      if (!canvas || !ctx || !tCtx) return;
      if (ts - last >= interval) {
        const img = tCtx.createImageData(GRAIN_TILE, GRAIN_TILE);
        const d = img.data;
        for (let y = 0; y < GRAIN_TILE; y += GRAIN_PX) {
          for (let x = 0; x < GRAIN_TILE; x += GRAIN_PX) {
            const v = (Math.random() * 255) | 0;
            for (let dy = 0; dy < GRAIN_PX; dy++) {
              for (let dx = 0; dx < GRAIN_PX; dx++) {
                const i = ((y + dy) * GRAIN_TILE + (x + dx)) * 4;
                d[i] = v; d[i + 1] = v; d[i + 2] = v; d[i + 3] = 255;
              }
            }
          }
        }
        tCtx.putImageData(img, 0, 0);
        const pattern = ctx.createPattern(tile, "repeat");
        if (pattern) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = pattern;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        last = ts;
      }
      animId = requestAnimationFrame(drawGrain);
    }

    animId = requestAnimationFrame(drawGrain);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div style={{ background: "#fff", padding: "64px 8px 8px" }}>
    <section
      id="top"
      className="relative overflow-hidden"
      style={{
        minHeight: "calc(100svh - 72px)",
        borderRadius: "24px",
        background: "#0d0d0d",
      }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0, opacity: 0.07, mixBlendMode: "screen" }}
      />

      {/* TITLE BLOCK — left side, vertically centered */}
      <div
        className="absolute"
        style={{
          left: "clamp(16px, 2vw, 40px)",
          top: "38%",
          transform: "translateY(-50%)",
          zIndex: 10,
        }}
      >
        <motion.div style={{ y: titleY }}>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease }}
          >
            <span style={{ display: "block", lineHeight: "0.82", marginLeft: "-8px" }}>
              <span
                className={plusJakarta.className}
                style={{ fontSize: "clamp(180px, 24vw, 380px)", color: "#fff", display: "inline-block" }}
              >
                shift
              </span>
            </span>
            <span
              className={plusJakarta.className}
              style={{
                display: "block",
                fontSize: "clamp(56px, 7vw, 112px)",
                lineHeight: "1",
                color: "#93cecc",
                textAlign: "right",
                width: "100%",
                marginTop: "8px",
              }}
            >
              Studio.
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* CORNER PLUS SIGNS */}
      <motion.span aria-hidden="true" className="absolute font-mono"
        style={{ top: "45%", left: 0, fontSize: "18px", color: "rgba(255,255,255,0.3)", zIndex: 10 }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.2, ease }}
      >+</motion.span>
      <motion.span aria-hidden="true" className="absolute font-mono"
        style={{ top: "45%", right: 0, fontSize: "18px", color: "rgba(255,255,255,0.3)", zIndex: 10 }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.2, ease }}
      >+</motion.span>
      <motion.span aria-hidden="true" className="absolute font-mono"
        style={{ bottom: "28%", left: 0, fontSize: "18px", color: "rgba(255,255,255,0.3)", zIndex: 10 }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.2, ease }}
      >+</motion.span>
      <motion.span aria-hidden="true" className="absolute font-mono"
        style={{ bottom: "28%", right: 0, fontSize: "18px", color: "rgba(255,255,255,0.3)", zIndex: 10 }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.2, ease }}
      >+</motion.span>

      {/* SERVICES LIST — right side, desktop only */}
      <div
        className="hidden md:block absolute"
        style={{ right: "clamp(24px, 4vw, 64px)", top: "50%", transform: "translateY(-50%)", zIndex: 10 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease }}
        >
          <ul
            className={plusJakarta.className}
            style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", lineHeight: "2.4", listStyle: "none", margin: 0, padding: 0 }}
          >
            <li>Sistemas &amp; Automatización</li>
            <li>Web de Alta Conversión</li>
            <li>Identidad &amp; Autoridad</li>
          </ul>
        </motion.div>
      </div>

      {/* BOTTOM LEFT — copy block */}
      <motion.div
        className="absolute"
        style={{ bottom: "clamp(32px, 5vh, 52px)", left: "clamp(20px, 3vw, 48px)", zIndex: 10 }}
        initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.65, ease }}
      >
        <p
          className={plusJakarta.className}
          style={{ fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.75)", maxWidth: "360px", lineHeight: "1.7", margin: 0 }}
        >
          Automatizamos <span style={{ color: "#93cecc" }}>operaciones</span>, construimos <span style={{ color: "#93cecc" }}>sistemas</span> y diseñamos la{" "}
          <span style={{ color: "#93cecc" }}>identidad</span> que te posiciona con <span style={{ color: "#93cecc" }}>autoridad</span>. Sin fricciones. Sin excusas.
        </p>
      </motion.div>

    </section>
    </div>
  );
}
