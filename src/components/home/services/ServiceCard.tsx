"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus_Jakarta_Sans } from "next/font/google";
import type { Service } from "@/lib/services";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "800" });

type Props = { service: Service; index: number };

export function ServiceCard({ service, index }: Props) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div
      style={{
        borderBottom: "1px solid rgba(0,0,0,0.15)",
        position: "relative",
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
          padding: "28px 0",
          gap: "24px",
          transition: "opacity 0.2s",
        }}
      >
        {/* Number */}
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            color: "#0ABAB5",
            letterSpacing: "0.08em",
            minWidth: "28px",
            opacity: open ? 1 : 0.5,
            transition: "opacity 0.2s",
          }}
        >
          {service.number}
        </span>

        {/* Thin teal line — visible when open */}
        <div
          style={{
            width: "2px",
            height: open ? "40px" : "0px",
            background: "#0ABAB5",
            flexShrink: 0,
            transition: "height 0.3s ease",
          }}
        />

        {/* Service name */}
        <span
          className={`${plusJakarta.className} flex-1`}
          style={{
            fontSize: "clamp(20px, 3vw, 32px)",
            color: open ? "#000" : "rgba(0,0,0,0.45)",
            letterSpacing: "-0.02em",
            transition: "color 0.25s ease",
          }}
        >
          {service.title}
        </span>

        {/* Toggle chevron */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke={open ? "#0ABAB5" : "rgba(0,0,0,0.25)"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease, stroke 0.25s ease",
          }}
        >
          <polyline points="3 6 8 11 13 6" />
        </svg>
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
            <div style={{ padding: "0 0 28px 52px" }}>
              <p
                className={plusJakarta.className}
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "rgba(0,0,0,0.55)",
                  lineHeight: "1.8",
                  maxWidth: "480px",
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
