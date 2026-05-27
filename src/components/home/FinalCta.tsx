"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Container } from "@/components/ui/Container";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "800" });

const GRAIN_FPS = 30;
const GRAIN_TILE = 256;
const GRAIN_PX = 2;
const ease = [0.22, 1, 0.36, 1] as const;

type FinalCtaProps = { onOpenContact?: () => void };

export function FinalCta({ onOpenContact }: FinalCtaProps) {
  const [hovered, setHovered] = useState(false);
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
    <div style={{ background: "#fff", padding: "8px" }}>
      <section
        id="contact"
        className="relative overflow-hidden"
        style={{
          background: "#0d0d0d",
          borderRadius: "24px",
          padding: "clamp(48px, 8vw, 96px) 0",
        }}
      >
        {/* Grain */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 0, opacity: 0.07, mixBlendMode: "screen", pointerEvents: "none" }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <Container>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                gap: "32px",
                flexWrap: "wrap",
              }}
            >

              {/* LEFT — Title */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease }}
              >
                <span
                  className={plusJakarta.className}
                  style={{
                    display: "block",
                    fontSize: "clamp(40px, 6vw, 80px)",
                    color: "#fff",
                    lineHeight: "0.85",
                    letterSpacing: "-0.03em",
                  }}
                >
                  ¿Listo para
                </span>
                <span
                  className={plusJakarta.className}
                  style={{
                    display: "block",
                    fontSize: "clamp(40px, 6vw, 80px)",
                    color: "#93cecc",
                    lineHeight: "0.85",
                    letterSpacing: "-0.03em",
                  }}
                >
                  construir?
                </span>
              </motion.div>

              {/* RIGHT — Meta + Button */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15, ease }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "20px",
                }}
              >
                <p
                  style={{
                    fontFamily: "monospace",
                    fontSize: "9px",
                    color: "rgba(255,255,255,0.3)",
                    letterSpacing: "0.18em",
                    textAlign: "right",
                    textTransform: "uppercase",
                    lineHeight: 1.8,
                    margin: 0,
                  }}
                >
                  Respuesta en el día
                  <br />
                  Córdoba, AR · WhatsApp
                </p>

                <button
                  type="button"
                  onClick={onOpenContact}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <span
                    className={plusJakarta.className}
                    style={{ fontSize: "16px", color: "#93cecc" }}
                  >
                    Hablemos
                  </span>
                  <div
                    style={{
                      width: hovered ? "56px" : "32px",
                      height: "1px",
                      background: "#93cecc",
                      transition: "width 0.3s ease",
                    }}
                  />
                </button>
              </motion.div>

            </div>
          </Container>
        </div>
      </section>
    </div>
  );
}
