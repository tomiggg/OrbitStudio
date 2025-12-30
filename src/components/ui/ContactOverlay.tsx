"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string; // <- lo usamos solo desktop si querés
  children: React.ReactNode;
};

export function ContactOverlay({
  open,
  onClose,
  title = "Contacto",
  subtitle,
  children,
}: Props) {
  // Lock body scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ESC close
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999]">
          {/* Overlay */}
          <motion.button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="absolute inset-0 h-full w-full bg-black/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* MOBILE: fullscreen sheet */}
          <motion.div
            className="absolute inset-y-0 right-0 w-full bg-[#8ED9D7] md:hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
          >
            {/* ✅ Mobile TopBar: minimal, sin subtitle */}
            <TopBar title={title} onClose={onClose} variant="mobile" />

            {/* ✅ el TopBar ahora es sticky, así que ajustamos altura real */}
            <div className="h-[calc(100dvh-64px)] overflow-y-auto px-6 pb-10 pt-6">
              {children}
            </div>
          </motion.div>

          {/* DESKTOP: right panel */}
          <motion.div
            className="
              hidden md:block
              absolute inset-y-0 right-0
              w-[520px] lg:w-[560px]
              bg-[#8ED9D7]
              shadow-[0_30px_80px_rgba(0,0,0,0.25)]
              border-l border-[#072b2a]/10
            "
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
          >
            {/* ✅ Desktop TopBar: title + subtitle opcional */}
            <TopBar title={title} subtitle={subtitle} onClose={onClose} variant="desktop" />

            <div className="h-[calc(100vh-84px)] overflow-y-auto px-8 pb-10 pt-8">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function TopBar({
  title,
  subtitle,
  onClose,
  variant,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  variant: "mobile" | "desktop";
}) {
  return (
    <div
      className="
        sticky top-0 z-20
        flex items-center justify-between gap-4
        px-5
        h-16
        border-b border-[#072b2a]/10
        bg-[#8ED9D7]/70 backdrop-blur-xl
      "
    >
      <div className="min-w-0">
        <div className="text-sm font-semibold tracking-[-0.01em] text-[#072b2a]/85">
          {title}
        </div>

        {/* ✅ solo desktop muestra subtitle (evita duplicar con el H3 grande del content) */}
        {variant === "desktop" && subtitle ? (
          <p className="mt-0.5 text-xs text-[#072b2a]/60">{subtitle}</p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="
          inline-flex h-11 w-11 items-center justify-center
          rounded-full
          border border-[#072b2a]/15
          bg-white/18 backdrop-blur
          text-[#072b2a]
          shadow-[0_10px_24px_rgba(0,0,0,0.14)]
          transition
          hover:bg-white/26
          active:scale-[0.98]
        "
        aria-label="Cerrar"
      >
        ✕
      </button>
    </div>
  );
}