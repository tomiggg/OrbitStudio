"use client";

import { motion } from "framer-motion";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Container } from "@/components/ui/Container";
import { useContact } from "@/components/contact/ContactProvider";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "800" });

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  heroTag?: string;
  externalUrl?: string;
  blocks: { label: string; content: React.ReactNode }[];
  highlights?: { title: string; items: string[] };
};

const ease = [0.22, 1, 0.36, 1] as const;

export function CaseLayout({
  eyebrow = "Caso real",
  title,
  subtitle,
  heroTag,
  externalUrl,
  blocks,
  highlights,
}: Props) {
  const { openContact } = useContact();

  return (
    <div style={{ background: "#a7e9e7", minHeight: "100svh", paddingTop: "80px" }}>
      <Container>
        <div
          style={{
            display: "flex",
            height: "calc(100svh - 80px)",
          }}
        >

          {/* LEFT COL */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            style={{
              width: "38%",
              flexShrink: 0,
              borderRight: "1px solid rgba(0,0,0,0.1)",
              padding: "32px 32px 32px 0",
              display: "flex",
              flexDirection: "column",
              position: "sticky",
              top: "80px",
              height: "calc(100svh - 80px)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "9px",
                color: "#0ABAB5",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginBottom: "48px",
              }}
            >
              // {eyebrow}{heroTag && ` · ${heroTag}`}
            </p>

            <h1
              className={plusJakarta.className}
              style={{
                fontSize: "clamp(36px, 4vw, 64px)",
                color: "#000",
                lineHeight: "0.85",
                letterSpacing: "-0.03em",
                textTransform: "none",
                paddingBottom: "12px",
              }}
            >
              {title.toLowerCase()}.
            </h1>

            {subtitle && (
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  color: "rgba(0,0,0,0.5)",
                  lineHeight: 1.7,
                  marginTop: "16px",
                  maxWidth: "280px",
                }}
              >
                {subtitle}
              </p>
            )}

            <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)", margin: "24px 0" }} />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                marginTop: "auto",
              }}
            >
              {externalUrl && (
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "10px",
                    color: "#000",
                    background: "#0ABAB5",
                    padding: "12px 20px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    display: "inline-block",
                    alignSelf: "flex-start",
                  }}
                >
                  [ VER PROYECTO LIVE ]
                </a>
              )}
              <button
                onClick={openContact}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "10px",
                  color: "rgba(0,0,0,0.5)",
                  background: "transparent",
                  border: "1px solid rgba(0,0,0,0.2)",
                  padding: "12px 20px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  alignSelf: "flex-start",
                }}
              >
                [ HABLEMOS ]
              </button>
            </div>
          </motion.div>

          {/* RIGHT COL */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              maxHeight: "calc(100svh - 80px)",
              padding: "32px 0 32px 32px",
              display: "flex",
              flexDirection: "column",
            }}
          >

            {/* Blocks grid 2 cols */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              {blocks.map((b, i) => (
                <motion.div
                  key={b.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07, ease }}
                  style={{
                    borderTop: "1px solid rgba(0,0,0,0.1)",
                    borderLeft: i % 2 === 1 ? "1px solid rgba(0,0,0,0.1)" : "none",
                    padding: "16px",
                    paddingLeft: i % 2 === 1 ? "16px" : "0",
                  }}
                >
                  <p
                    className={plusJakarta.className}
                    style={{
                      fontSize: "11px",
                      color: "rgba(0,0,0,0.4)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                    }}
                  >
                    {b.label}
                  </p>
                  <div
                    className={plusJakarta.className}
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "rgba(0,0,0,0.55)",
                      lineHeight: 1.8,
                    }}
                  >
                    {b.content}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Highlights */}
            {highlights && (
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: "16px" }}>
                <p
                  className={plusJakarta.className}
                  style={{
                    fontSize: "11px",
                    color: "rgba(0,0,0,0.4)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                  }}
                >
                  {highlights.title}
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {highlights.items.map((item, i) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: i * 0.08, ease }}
                      style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "flex-start",
                        borderTop: "1px solid rgba(0,0,0,0.08)",
                        padding: "10px 0",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "10px",
                          color: "#0ABAB5",
                          minWidth: "24px",
                          flexShrink: 0,
                          letterSpacing: "0.08em",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={plusJakarta.className}
                        style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "rgba(0,0,0,0.55)",
                          lineHeight: 1.7,
                        }}
                      >
                        {item}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bottom CTA */}
            <div
              style={{
                borderTop: "1px solid rgba(0,0,0,0.1)",
                paddingTop: "16px",
                marginTop: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "20px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "9px",
                    color: "#0ABAB5",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    marginBottom: "4px",
                  }}
                >
                  // ¿PROBLEMA PARECIDO?
                </p>
                <p
                  className={plusJakarta.className}
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "rgba(0,0,0,0.5)",
                    lineHeight: 1.5,
                  }}
                >
                  Analizamos tu caso sin compromiso.
                </p>
              </div>
              <button
                onClick={openContact}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "10px",
                  color: "#000",
                  background: "#0ABAB5",
                  border: "none",
                  padding: "12px 20px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                [ HABLEMOS ]
              </button>
            </div>

          </div>
        </div>
      </Container>
    </div>
  );
}
