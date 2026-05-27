"use client";

import { motion } from "framer-motion";
import { Plus_Jakarta_Sans } from "next/font/google";
import type { Project } from "@/lib/projects";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "800" });
const plusJakartaBody = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "500" });
const ease = [0.22, 1, 0.36, 1] as const;

type Props = { project: Project; index: number };

export function ProjectCard({ project: p, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.12, ease }}
      className="group relative overflow-hidden cursor-pointer"
      style={{ borderRadius: "12px", background: "rgba(0,0,0,0.1)", aspectRatio: "4/3" }}
    >

      {/* TOP BAR */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(8px)",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span className={plusJakarta.className} style={{ fontSize: "13px", color: "#000" }}>
            {p.title}
          </span>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "11px",
              color: "rgba(0,0,0,0.35)",
            }}
          >
            /2025
          </span>
          {p.serviceTag && (
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "9px",
                fontWeight: 700,
                background: "rgba(0,0,0,0.08)",
                color: "rgba(0,0,0,0.5)",
                padding: "3px 8px",
                borderRadius: "20px",
                letterSpacing: "0.04em",
              }}
            >
              {p.serviceTag}
            </span>
          )}
        </div>

        {/* Right — three dots */}
        <div style={{ display: "flex", gap: "4px" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(0,0,0,0.15)" }} />
          ))}
        </div>
      </div>

      {/* IMAGE */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {p.imageSrc ? (
          <img
            src={p.imageSrc}
            alt={p.title}
            className="w-full h-full object-cover transition-[transform,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] group-hover:blur-[2px] group-hover:brightness-[0.4]"
            style={{ opacity: 0.85 }}
            loading="lazy"
          />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "rgba(10,186,181,0.12)" }} />
        )}
      </div>

      {/* HOVER OVERLAY — description + CTA */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 7,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "24px",
          textAlign: "center",
          gap: "10px",
        }}
        className="opacity-0 translate-y-[8px] transition-[opacity,transform] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:translate-y-0"
      >
        {/* Category tag */}
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "9px",
            color: "#0ABAB5",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          {"[ " + (p.serviceTag ?? "") + " ]"}
        </span>

        {/* Title (duplicated so it stays readable during transition) */}
        <div
          className={plusJakarta.className}
          style={{ fontSize: "clamp(22px, 3vw, 34px)", color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.05 }}
        >
          {p.title}
        </div>

        {/* Description */}
        <p
          className={plusJakartaBody.className}
          style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.7,
            maxWidth: "220px",
            margin: 0,
          }}
        >
          {p.description}
        </p>

        {/* CTA minimal */}
        {p.case?.externalUrl && (
          <a
            href={p.case.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              textDecoration: "none",
              pointerEvents: "auto",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.85)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
          >
            ver caso →
          </a>
        )}
      </div>

    </motion.div>
  );
}
