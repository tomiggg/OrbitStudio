"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function ContactOverlay({ open, onClose, children }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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

  const header = (
    <div
      style={{
        height: "52px",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
      }}
    >
      <Logo variant="mark" theme="light" size={28} />
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
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
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 9998 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {isMobile ? (
            /* ── MOBILE: bottom sheet ── */
            <motion.div
              role="dialog"
              aria-modal="true"
              style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                background: "#f0f0ee",
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
                maxHeight: "92dvh",
                borderRadius: "20px 20px 0 0",
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
            >
              {/* Drag handle */}
              <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px", flexShrink: 0 }}>
                <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "rgba(0,0,0,0.12)" }} />
              </div>
              {header}
              <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px 48px", WebkitOverflowScrolling: "touch" }}>
                {children}
              </div>
            </motion.div>
          ) : (
            /* ── DESKTOP: right drawer, half screen ── */
            <motion.div
              role="dialog"
              aria-modal="true"
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                bottom: 0,
                width: "50vw",
                background: "#f0f0ee",
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
                borderRadius: "20px 0 0 20px",
              }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 280 }}
            >
              {header}
              <div style={{ flex: 1, overflowY: "auto", padding: "36px 40px 52px" }}>
                {children}
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
