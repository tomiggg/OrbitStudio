"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "800" });

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
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.55)",
              zIndex: 9998,
            }}
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
                background: "#FAFCFC",
                zIndex: 9999,
                borderRadius: "20px 20px 0 0",
                display: "flex",
                flexDirection: "column",
                maxHeight: "92dvh",
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.35, ease }}
            >
              {/* drag handle */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "12px 0 4px",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "4px",
                    borderRadius: "2px",
                    background: "rgba(7,43,42,0.15)",
                  }}
                />
              </div>

              {/* Header */}
              <div
                style={{
                  height: "52px",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 20px",
                  borderBottom: "1px solid rgba(7,43,42,0.07)",
                }}
              >
                <span
                  className={plusJakarta.className}
                  style={{ fontSize: "13px", color: "#000" }}
                >
                  SHIFT_STUDIO
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar"
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    border: "1px solid rgba(7,43,42,0.15)",
                    background: "transparent",
                    color: "rgba(7,43,42,0.6)",
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "24px 20px 40px",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {children}
              </div>
            </motion.div>
          ) : (
            /* ── DESKTOP: right drawer ── */
            <motion.div
              role="dialog"
              aria-modal="true"
              style={{
                position: "fixed",
                top: 0,
                bottom: 0,
                right: 0,
                width: "480px",
                background: "#FAFCFC",
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
                height: "100dvh",
              }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease }}
            >
              {/* Header */}
              <div
                style={{
                  height: "56px",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 24px",
                  borderBottom: "1px solid rgba(7,43,42,0.08)",
                  background: "#FAFCFC",
                }}
              >
                <span
                  className={plusJakarta.className}
                  style={{ fontSize: "13px", color: "#000" }}
                >
                  SHIFT_STUDIO
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    border: "1px solid rgba(7,43,42,0.15)",
                    background: "transparent",
                    color: "rgba(7,43,42,0.6)",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(7,43,42,0.06)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "32px 24px 48px",
                }}
              >
                {children}
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
