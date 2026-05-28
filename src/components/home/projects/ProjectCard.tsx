"use client";

import { Plus_Jakarta_Sans } from "next/font/google";
import type { Project } from "@/lib/projects";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "800" });

const ink = "#0d0d0d";
const sky = "#9EC7D4";
const mute = "#7a7a7a";

const NUMBERS = ["01", "02", "03", "04"];

type Props = { project: Project; index: number };

export function ProjectCard({ project: p, index }: Props) {
  return (
    <div className="group cursor-pointer" style={{ display: "flex", flexDirection: "column" }}>
      {/* IMAGE */}
      <div style={{ position: "relative", overflow: "hidden", aspectRatio: "4/3" }}>
        {p.imageSrc ? (
          <img
            src={p.imageSrc}
            alt={p.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div style={{ width: "100%", height: "100%", background: `${sky}22` }} />
        )}
      </div>

      {/* META */}
      <div style={{ borderTop: `1px solid ${ink}`, paddingTop: "10px" }}>
        {/* Number + CTA row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
            marginBottom: "5px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "10px",
              letterSpacing: "0.22em",
              color: mute,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              flex: 1,
            }}
          >
            {NUMBERS[index]}
            {p.serviceTag && (
              <span style={{ marginLeft: "8px", textTransform: "uppercase" }}>
                · {p.serviceTag}
              </span>
            )}
          </span>
          {p.case?.externalUrl && (
            <a
              href={p.case.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "10px",
                color: mute,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                textDecoration: "none",
                flexShrink: 0,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = ink)}
              onMouseLeave={(e) => (e.currentTarget.style.color = mute)}
            >
              ver →
            </a>
          )}
        </div>

        {/* Title */}
        <span
          className={plusJakarta.className}
          style={{
            fontSize: "14px",
            color: ink,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            display: "block",
          }}
        >
          {p.title}
        </span>
      </div>
    </div>
  );
}
