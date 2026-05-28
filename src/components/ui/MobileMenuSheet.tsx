"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Logo } from "@/components/ui/Logo";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "800" });
const plusJakartaBody = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "400" });

export type MobileNavItem = { href: string; label: string };

type Props = {
  open: boolean;
  onClose: () => void;
  items: MobileNavItem[];
  cta: { label: string };
  onCta: () => void;
};

export function MobileMenuSheet({ open, onClose, items, cta, onCta }: Props) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="md:hidden" style={{ position: "fixed", inset: 0, zIndex: 9999 }}>

          {/* Backdrop */}
          <motion.div
            onClick={onClose}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Top sheet */}
          <motion.div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              background: "#f0f0ee",
              borderRadius: "0 0 20px 20px",
              display: "flex",
              flexDirection: "column",
            }}
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
          >
            {/* Header */}
            <div
              style={{
                height: "52px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 20px",
                borderBottom: "1px solid rgba(0,0,0,0.07)",
              }}
            >
              <Logo variant="mark" theme="light" size={28} />
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar menú"
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  border: "1px solid rgba(0,0,0,0.15)",
                  background: "rgba(0,0,0,0.05)",
                  color: "rgba(0,0,0,0.5)",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "background 0.2s, color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(0,0,0,0.1)";
                  e.currentTarget.style.color = "#000";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(0,0,0,0.05)";
                  e.currentTarget.style.color = "rgba(0,0,0,0.5)";
                }}
              >
                ✕
              </button>
            </div>

            {/* Nav links */}
            <nav style={{ padding: "8px 0" }}>
              {items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "18px 20px",
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                    textDecoration: "none",
                  }}
                >
                  <span
                    className={plusJakarta.className}
                    style={{
                      fontSize: "22px",
                      color: "#0d0d0d",
                      letterSpacing: "-0.03em",
                      textTransform: "none",
                    }}
                  >
                    {item.label}
                  </span>
                  <span
                    className={plusJakartaBody.className}
                    style={{ color: "rgba(0,0,0,0.2)", fontSize: "16px" }}
                  >
                    →
                  </span>
                </a>
              ))}
            </nav>

            {/* CTA */}
            <div style={{ padding: "16px 20px 20px" }}>
              <button
                type="button"
                onClick={() => { onClose(); onCta(); }}
                className={plusJakarta.className}
                style={{
                  width: "100%",
                  padding: "18px",
                  background: "#0d0d0d",
                  color: "#fff",
                  fontSize: "13px",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {cta.label}
              </button>
            </div>

            {/* Drag handle — bottom */}
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 16px" }}>
              <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "rgba(0,0,0,0.12)" }} />
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
