"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MobileMenuSheet } from "@/components/ui/MobileMenuSheet";
import { useContact } from "@/components/contact/ContactProvider";

const NAV_ITEMS = [
  { href: "#services", label: "Servicios" },
  { href: "#portfolio", label: "Proyectos" },
  { href: "#process", label: "Proceso" },
];

const CTA = { href: "#contact", label: "Contactanos" };

const linkBase =
  "text-sm font-semibold text-[color:var(--title)]/90 no-underline transition hover:text-[color:var(--title)]";

const ctaPill =
  "inline-flex items-center justify-center rounded-full bg-black px-5 py-2 text-sm font-semibold text-white no-underline shadow-[0_10px_26px_rgba(0,0,0,0.35)] transition hover:bg-black/90";

export function Header() {
  const [open, setOpen] = useState(false);
  const { openContact } = useContact();

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Glass band */}
      <div
        className="
          relative
          bg-white/10
          backdrop-blur-2xl
          shadow-[0_10px_30px_rgba(0,0,0,0.10)]
        "
      >
        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute inset-0
            bg-[linear-gradient(180deg,rgba(255,255,255,0.35),rgba(255,255,255,0.06))]
          "
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/25"
        />

        {/* ✅ Mobile igual / ✅ Desktop más bajo */}
        <div className="relative mx-auto flex h-16 w-full max-w-[1100px] items-center justify-between px-5 py-3 md:h-20 md:px-8 md:py-3">
          <Link
            href="/"
            className="flex items-center no-underline"
            aria-label="Orbit Studio"
          >
            {/* ✅ Logo un toque más chico en desktop */}
            <img
              src="/logo/orbit-logo-header.png"
              alt="Orbit Studio"
              loading="eager"
              className="block h-auto w-auto max-h-9 md:max-h-10 max-w-[140px] md:max-w-[180px] object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-10 md:flex md:gap-8">
            {NAV_ITEMS.map((item) => (
              <a key={item.href} href={item.href} className={linkBase}>
                {item.label}
              </a>
            ))}

            {/* ✅ CTA abre modal (no navega al hash) */}
            <button
              type="button"
              onClick={openContact}
              className={ctaPill}
              aria-label="Abrir contacto"
            >
              {CTA.label}
            </button>
          </nav>

          {/* Mobile toggle button */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="
              md:hidden
              inline-flex items-center justify-center
              h-11 w-11
              rounded-full
              border border-white/25
              bg-white/18
              backdrop-blur-xl
              text-[color:var(--title)]
              shadow-[0_10px_24px_rgba(0,0,0,0.14)]
              transition
              hover:bg-white/26
              hover:scale-[1.03]
              active:scale-[0.96]
            "
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            <span
              aria-hidden
              className={[
                "leading-none",
                "transition-transform duration-200",
                open ? "text-[18px] -translate-y-[0.5px]" : "text-[20px]",
              ].join(" ")}
            >
              {open ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </div>

      <MobileMenuSheet
        open={open}
        onClose={() => setOpen(false)}
        items={NAV_ITEMS}
        cta={CTA}
      />
    </header>
  );
}