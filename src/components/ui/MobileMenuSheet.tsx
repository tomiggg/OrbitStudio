"use client";

import { useEffect } from "react";

export type MobileNavItem = { href: string; label: string };

type Props = {
  open: boolean;
  onClose: () => void;
  items: MobileNavItem[];
  cta: { href: string; label: string };
};

export function MobileMenuSheet({ open, onClose, items, cta }: Props) {
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
    <div
      className={[
        "md:hidden",
        "fixed inset-0 z-[9999]",
        open ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
      aria-hidden={!open}
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        className={[
          "absolute inset-0 transition-opacity duration-200",
          open ? "opacity-100 bg-black/55" : "opacity-0 bg-black/0",
        ].join(" ")}
      />

      {/* Panel full (bg liso) */}
      <div
        className={[
          "absolute inset-0",
          "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "translate-x-0" : "translate-x-full",
          "bg-[#8ED9D7]",
        ].join(" ")}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 pt-5">
          <div className="text-sm font-semibold text-[#072b2a]/80">Menú</div>

          {/* Close button (MISMO estilo que el header toggle) */}
          <button
            type="button"
            onClick={onClose}
            className="
              inline-flex items-center justify-center
              h-10 w-10
              rounded-full
              border border-white/25
              bg-white/25
              backdrop-blur-xl
              text-[#072b2a]
              shadow-[0_8px_20px_rgba(0,0,0,0.12)]
              transition
              hover:bg-white/35
              hover:scale-[1.03]
              active:scale-[0.96]
            "
            aria-label="Cerrar menú"
          >
            <span aria-hidden style={{ fontSize: 18, lineHeight: 1 }}>
              ✕
            </span>
          </button>
        </div>

        {/* Centered nav */}
        <div className="flex h-[calc(100dvh-88px)] flex-col items-center justify-center px-8 text-center">
          <nav className="flex flex-col items-center gap-8">
            {items.map((it) => (
              <a
                key={it.href}
                href={it.href}
                onClick={onClose}
                className="
                  text-3xl font-semibold
                  tracking-[-0.02em]
                  text-[#072b2a]
                  no-underline
                  transition
                  active:scale-[0.98]
                "
              >
                {it.label}
              </a>
            ))}
          </nav>

          <a
            href={cta.href}
            onClick={onClose}
            className="
              mt-14 inline-flex items-center justify-center
              rounded-full
              bg-[#072b2a]
              px-10 py-4
              text-lg font-semibold
              text-white
              no-underline
              shadow-[0_18px_45px_rgba(0,0,0,0.30)]
              active:scale-[0.99]
            "
          >
            {cta.label}
          </a>
        </div>
      </div>
    </div>
  );
}