"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus_Jakarta_Sans } from "next/font/google";
import type { Service } from "@/lib/services";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "800" });

const BOX_PALETTE = [
  { bg: "rgba(167,233,231,0.25)", border: "rgba(10,186,181,0.2)",  text: "rgba(10,186,181,0.65)" },
  { bg: "rgba(167,233,231,0.45)", border: "rgba(10,186,181,0.35)", text: "rgba(10,186,181,0.82)" },
  { bg: "rgba(10,186,181,0.15)",  border: "rgba(10,186,181,0.55)", text: "#0ABAB5"               },
];

type Props = { service: Service; index: number };

export function ServiceCard({ service, index }: Props) {
  const [open, setOpen] = useState(index === 0);
  const palette = BOX_PALETTE[index % BOX_PALETTE.length];

  return (
    <div
      style={{
        borderBottom: open
          ? "1px solid rgba(10,186,181,0.2)"
          : "1px solid rgba(0,0,0,0.1)",
        position: "relative",
        transition: "border-color 0.3s ease",
      }}
    >
      {/* ROW */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => e.key === "Enter" && setOpen((v) => !v)}
        className="flex items-center cursor-pointer"
        style={{
          padding: "24px 0",
          gap: "20px",
          background: open ? "rgba(0,0,0,0.03)" : "transparent",
          transition: "background 0.2s",
        }}
      >
        {/* Number box */}
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{
            width: "56px",
            height: "56px",
            background: palette.bg,
            border: `1px solid ${palette.border}`,
            borderRadius: "12px",
            transition: "background 0.2s, border-color 0.2s",
          }}
        >
          <span
            className={plusJakarta.className}
            style={{
              fontSize: "16px",
              color: palette.text,
              letterSpacing: "-0.02em",
            }}
          >
            {service.number}
          </span>
        </div>

        {/* Service name */}
        <span
          className={`${plusJakarta.className} flex-1`}
          style={{
            fontSize: "clamp(18px, 2.5vw, 24px)",
            color: open ? "#000" : "rgba(0,0,0,0.7)",
            transition: "color 0.2s",
          }}
        >
          {service.title}
        </span>

        {/* Toggle */}
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: open ? "1px solid #0ABAB5" : "1px solid rgba(0,0,0,0.15)",
            background: open ? "rgba(10,186,181,0.08)" : "transparent",
            transition: "all 0.25s ease",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke={open ? "#0ABAB5" : "rgba(0,0,0,0.35)"}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease, stroke 0.25s ease",
            }}
          >
            <polyline points="2 5 7 10 12 5" />
          </svg>
        </div>
      </div>

      {/* ACCORDION BODY */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "16px 0 24px 76px" }}>
              <p
                className={plusJakarta.className}
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "rgba(0,0,0,0.55)",
                  lineHeight: "1.7",
                  maxWidth: "520px",
                  margin: 0,
                }}
              >
                {service.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
