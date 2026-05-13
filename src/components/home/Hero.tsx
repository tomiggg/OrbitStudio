"use client";

import { useEffect } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "800" });

type HeroProps = { onOpenContact?: () => void };

export function Hero({ onOpenContact: _ }: HeroProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, []);

  return (
    <section
      id="top"
      className="relative overflow-hidden"
      style={{ minHeight: "100svh", background: "#000" }}
    >
      {/* Video background */}
      <video
        src="/hero-video-web.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        style={{ zIndex: 0 }}
      />

      {/* Dark overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.6)", zIndex: 1 }}
      />

      {/* TAG — top left */}
      <p
        className="absolute uppercase"
        style={{
          top: "clamp(80px, 10vh, 100px)",
          left: "clamp(20px, 3vw, 48px)",
          fontFamily: "var(--font-body), monospace",
          fontSize: "9px",
          color: "#0ABAB5",
          letterSpacing: "0.18em",
          zIndex: 10,
          margin: 0,
        }}
      >
        // SHIFT_STUDIO · CÓRDOBA_AR
      </p>

      {/* TITLE BLOCK — left side, vertically centered */}
      <div
        className="absolute"
        style={{
          left: "clamp(16px, 2vw, 40px)",
          top: "45%",
          transform: "translateY(-50%)",
          zIndex: 10,
        }}
      >
        <span
          style={{
            display: "block",
            lineHeight: "0.82",
            marginLeft: "-8px",
          }}
        >
          <span
            className={plusJakarta.className}
            style={{
              fontSize: "clamp(160px, 20vw, 320px)",
              color: "#fff",
              display: "inline-block",
            }}
          >
            shif<span style={{ color: "#0ABAB5" }}>t</span>
          </span>
        </span>
        <span
          className={plusJakarta.className}
          style={{
            display: "block",
            fontSize: "clamp(48px, 6vw, 96px)",
            lineHeight: "1",
            color: "#fff",
            textAlign: "right",
            width: "100%",
            marginTop: "8px",
          }}
        >
          Studio.
        </span>
      </div>

      {/* CORNER PLUS SIGNS */}
      <span
        aria-hidden="true"
        className="absolute font-mono"
        style={{ top: "45%", left: 0, fontSize: "18px", color: "rgba(255,255,255,0.3)", zIndex: 10 }}
      >
        +
      </span>
      <span
        aria-hidden="true"
        className="absolute font-mono"
        style={{ top: "45%", right: 0, fontSize: "18px", color: "rgba(255,255,255,0.3)", zIndex: 10 }}
      >
        +
      </span>
      <span
        aria-hidden="true"
        className="absolute font-mono"
        style={{ bottom: "28%", left: 0, fontSize: "18px", color: "rgba(255,255,255,0.3)", zIndex: 10 }}
      >
        +
      </span>
      <span
        aria-hidden="true"
        className="absolute font-mono"
        style={{ bottom: "28%", right: 0, fontSize: "18px", color: "rgba(255,255,255,0.3)", zIndex: 10 }}
      >
        +
      </span>

      {/* SERVICES LIST — right side, desktop only */}
      <div
        className="hidden md:block absolute"
        style={{
          right: "clamp(24px, 4vw, 64px)",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
        }}
      >
        <ul
          className={plusJakarta.className}
          style={{
            fontSize: "14px",
            color: "rgba(255,255,255,0.75)",
            lineHeight: "2.4",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          <li>Sistemas &amp; Automatización</li>
          <li>Web de Alta Conversión</li>
          <li>Identidad &amp; Autoridad</li>
        </ul>
      </div>

      {/* BOTTOM LEFT — copy block */}
      <div
        className="absolute"
        style={{
          bottom: "clamp(32px, 5vh, 52px)",
          left: "clamp(20px, 3vw, 48px)",
          zIndex: 10,
        }}
      >
        <p
          className={plusJakarta.className}
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "rgba(255,255,255,0.75)",
            maxWidth: "360px",
            lineHeight: "1.7",
            margin: 0,
          }}
        >
          Automatizamos operaciones, construimos sistemas y diseñamos la
          identidad que te posiciona con autoridad. Sin fricciones. Sin excusas.
        </p>
      </div>
    </section>
  );
}
