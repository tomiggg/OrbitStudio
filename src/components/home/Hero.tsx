"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "800" });
const plusJakartaBody = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "400" });

const GRAIN_FPS = 30;
const GRAIN_TILE = 256;
const GRAIN_PX = 2;
const ease = [0.22, 1, 0.36, 1] as const;

type HeroProps = { onOpenContact?: () => void };

export function Hero({ onOpenContact: _onOpenContact }: HeroProps) {
  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 600], [0, -80]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, []);

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

  const services = (
    <ul
      className={plusJakarta.className}
      style={{
        fontSize: "13px",
        color: "rgba(255,255,255,0.35)",
        lineHeight: 2.2,
        listStyle: "none",
        margin: 0,
        padding: 0,
        textAlign: "right",
        flexShrink: 0,
      }}
    >
      <li>Sistemas &amp; Automatización</li>
      <li>Web de Alta Conversión</li>
      <li>Identidad &amp; Autoridad</li>
    </ul>
  );

  return (
    <div style={{ background: "#f0f0ee", padding: isMobile ? "60px 3px 3px" : "64px 4px 4px" }}>
      <section
        id="top"
        className="relative overflow-hidden"
        style={{
          minHeight: isMobile ? "94svh" : "88svh",
          borderRadius: "24px",
          background: "#0d0d0d",
          display: "flex",
          flexDirection: "column",
          padding: "clamp(28px, 4vw, 48px)",
        }}
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 0, opacity: 0.1, mixBlendMode: "screen" }}
        />

        {/* Headline */}
        <motion.div
          style={{
            y: titleY,
            flex: isMobile ? 0 : 1,
            display: "flex",
            alignItems: isMobile ? "flex-start" : "center",
            position: "relative",
            zIndex: 10,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
          >
            <h1
              className={plusJakarta.className}
              style={{
                fontSize: "clamp(100px, 26vw, 260px)",
                lineHeight: 0.86,
                letterSpacing: "-0.04em",
                margin: 0,
                color: "#fff",
                textTransform: "none",
              }}
            >
              shift<span style={{ fontSize: "0.3em", position: "relative", top: "-1.8em", letterSpacing: 0 }}>©</span><br />
              <em style={{ fontStyle: "italic", color: "#9EC7D4" }}>studio.</em>
            </h1>
          </motion.div>
        </motion.div>

        {/* Mobile center — services list */}
        {isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.55, ease }}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              position: "relative",
              zIndex: 10,
            }}
          >
            {services}
          </motion.div>
        )}

        {/* Bottom row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65, ease }}
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "32px",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <p
            className={plusJakartaBody.className}
            style={{
              fontSize: isMobile ? "16px" : "clamp(13px, 1.4vw, 16px)",
              color: "rgba(255,255,255,0.5)",
              maxWidth: "380px",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            Automatizamos <span style={{ color: "#9EC7D4" }}>operaciones</span>, construimos{" "}
            <span style={{ color: "#9EC7D4" }}>sistemas</span> y diseñamos la{" "}
            <span style={{ color: "#9EC7D4" }}>identidad</span> que te posiciona con{" "}
            <span style={{ color: "#9EC7D4" }}>autoridad</span>.
          </p>

          {/* Desktop only */}
          {!isMobile && services}
        </motion.div>

      </section>
    </div>
  );
}
