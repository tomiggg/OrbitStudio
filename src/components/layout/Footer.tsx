"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText("shiftstudio.work@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <footer
      className="py-6"
      style={{
        background: "#f0f0ee",
        borderTop: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <Container>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
            flexWrap: "wrap",
          }}
        >

          {/* LEFT — Brand */}
          <Logo theme="light" size={28} variant="mark" />

          {/* CENTER — Nav links (desktop only) */}
          <div className="hidden md:flex" style={{ gap: "24px" }}>
            {[
              { href: "#services", label: "Servicios" },
              { href: "#portfolio", label: "Proyectos" },
              { href: "#process", label: "Proceso" },
              { href: "#contact", label: "Contacto" },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  color: "rgba(0,0,0,0.35)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#000")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(0,0,0,0.35)")}
              >
                {label}
              </a>
            ))}
          </div>

          {/* RIGHT — Email + copyright */}
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "16px" }}>
            <button
              type="button"
              onClick={handleCopy}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "10px",
                color: copied ? "#0ABAB5" : "rgba(0,0,0,0.5)",
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                transition: "color 0.2s, opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {copied ? "// COPIED" : "shiftstudio.work@gmail.com"}
            </button>

            <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "rgba(0,0,0,0.15)" }}>·</span>

            <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "rgba(0,0,0,0.25)" }}>
              © 2025 Shift Studio
            </span>
          </div>

        </div>
      </Container>
    </footer>
  );
}
