"use client";

import { motion } from "framer-motion";
import { Plus_Jakarta_Sans } from "next/font/google";
import type { Project } from "@/lib/projects";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "800" });

type Props = { project: Project; index: number };

export function ProjectCard({ project: p, index }: Props) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{ borderBottom: "1px solid rgba(0,0,0,0.12)" }}
    >
      <div className="group block">
        <div
          className="flex items-center transition-colors duration-200 group-hover:bg-black/5"
          style={{ padding: "28px 0", gap: "24px" }}
        >

          {/* Number */}
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              color: "#0ABAB5",
              letterSpacing: "0.08em",
              minWidth: "28px",
              flexShrink: 0,
            }}
          >
            {num}
          </span>

          {/* Image */}
          <div
            style={{
              width: "200px",
              height: "130px",
              flexShrink: 0,
              overflow: "hidden",
              background: "rgba(0,0,0,0.08)",
            }}
          >
            {p.imageSrc ? (
              <img
                src={p.imageSrc}
                alt={`Preview ${p.title}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ opacity: 0.9 }}
                loading="lazy"
              />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "rgba(10,186,181,0.12)" }} />
            )}
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="flex items-center" style={{ gap: "12px", marginBottom: "8px" }}>
              <h3
                className={plusJakarta.className}
                style={{
                  fontSize: "clamp(18px, 2vw, 22px)",
                  color: "#000",
                  lineHeight: 1,
                  margin: 0,
                  textTransform: "none",
                }}
              >
                {p.title}
              </h3>
              {p.serviceTag && (
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "9px",
                    color: "rgba(0,0,0,0.35)",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  [ {p.serviceTag} ]
                </span>
              )}
            </div>
            <p
              className={plusJakarta.className}
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "rgba(0,0,0,0.55)",
                lineHeight: 1.8,
                maxWidth: "480px",
                margin: 0,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              } as React.CSSProperties}
            >
              {p.description}
            </p>
          </div>


        </div>
      </div>
    </motion.div>
  );
}
