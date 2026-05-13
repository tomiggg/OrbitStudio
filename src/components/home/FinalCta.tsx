"use client";

import { useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Container } from "@/components/ui/Container";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "800" });

type FinalCtaProps = {
  onOpenContact?: () => void;
};

export function FinalCta({ onOpenContact }: FinalCtaProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <section
      id="contact"
      className="py-20 md:py-28"
      style={{
        background: "#000",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
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
          <div>
            <span
              className={plusJakarta.className}
              style={{
                display: "block",
                fontSize: "clamp(40px, 6vw, 80px)",
                color: "#fff",
                lineHeight: "0.85",
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              ¿Listo para
            </span>
            <span
              className={plusJakarta.className}
              style={{
                display: "block",
                fontSize: "clamp(40px, 6vw, 80px)",
                color: "#0ABAB5",
                lineHeight: "0.85",
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              construir?
            </span>
          </div>

          {/* RIGHT — Meta + Button */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "20px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "10px",
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.1em",
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
                style={{
                  fontSize: "16px",
                  color: "#0ABAB5",
                }}
              >
                Hablemos
              </span>
              <div
                style={{
                  width: hovered ? "56px" : "32px",
                  height: "1px",
                  background: "#0ABAB5",
                  transition: "width 0.3s ease",
                }}
              />
            </button>
          </div>

        </div>
      </Container>
    </section>
  );
}
