"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "800" });

const GRAIN_FPS = 30;
const GRAIN_TILE = 256;
const GRAIN_PX = 2;
const ease = [0.22, 1, 0.36, 1] as const;

type FinalCtaProps = { onOpenContact?: () => void };

export function FinalCta({ onOpenContact }: FinalCtaProps) {
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
    <div style={{ background: "#f0f0ee", padding: "4px" }}>
      <section
        id="contact"
        className="relative overflow-hidden"
        style={{
          background: "#0d0d0d",
          borderRadius: "24px",
          minHeight: "60svh",
          display: "flex",
          flexDirection: "column",
          padding: "clamp(28px, 4vw, 48px)",
        }}
      >
        {/* Grain */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 0, opacity: 0.07, mixBlendMode: "screen", pointerEvents: "none" }}
        />

        {/* Title — ocupa el espacio central */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease }}
          style={{ flex: 1, display: "flex", alignItems: "center", position: "relative", zIndex: 10 }}
        >
          <h2
            className={plusJakarta.className}
            style={{
              fontSize: "clamp(72px, 12vw, 200px)",
              lineHeight: 0.86,
              letterSpacing: "-0.04em",
              margin: 0,
              color: "#fff",
              textTransform: "none",
            }}
          >
            ¿Listo para<br />
            <em style={{ fontStyle: "italic", color: "#9EC7D4" }}>construir?</em>
          </h2>
        </motion.div>

        {/* Bottom row — igual que Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.45, ease }}
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
          {/* Meta */}
          <p
            className={plusJakarta.className}
            style={{
              fontSize: "clamp(13px, 1.4vw, 16px)",
              fontWeight: 400,
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            Respuesta en el día ·{" "}
            <span style={{ color: "#9EC7D4" }}>Córdoba, AR</span>
          </p>

          {/* Hablemos — CTA tipográfico grande */}
          <button
            type="button"
            onClick={onOpenContact}
            className={plusJakarta.className}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <motion.em
              style={{
                fontStyle: "italic",
                color: "#9EC7D4",
                fontSize: "clamp(40px, 6vw, 96px)",
                lineHeight: 0.86,
                letterSpacing: "-0.04em",
                display: "block",
              }}
              whileHover={{ opacity: 0.65 }}
              transition={{ duration: 0.2 }}
            >
              Hablemos →
            </motion.em>
          </button>
        </motion.div>

      </section>
    </div>
  );
}
