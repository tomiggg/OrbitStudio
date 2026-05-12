"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { MobileMenuSheet } from "@/components/ui/MobileMenuSheet";
import { useContact } from "@/components/contact/ContactProvider";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "800" });

const NAV_ITEMS = [
  { href: "#services", label: "Servicios" },
  { href: "#portfolio", label: "Proyectos" },
  { href: "#process", label: "Proceso" },
];

const CTA = { href: "#contact", label: "Contactanos" };

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openContact } = useContact();

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        style={{
          background: scrolled ? "rgba(0,0,0,0.92)" : "transparent",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
          transition: "background 0.3s ease, border-color 0.3s ease",
        }}
      >
        <div className="relative mx-auto flex h-12 w-full max-w-[1100px] items-center justify-between px-5 md:h-14 md:px-8">

          {/* Logo */}
          <Link href="/" className="flex items-center no-underline" aria-label="Shift Studio">
            <span
              className={plusJakarta.className}
              style={{ fontSize: "clamp(22px, 2.5vw, 28px)", color: "#fff", lineHeight: "1" }}
            >
              shift
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`${plusJakarta.className} no-underline transition hover:text-white`}
                style={{
                  fontSize: "13px",
                  color: scrolled ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.8)",
                }}
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={openContact}
              className={`${plusJakarta.className} inline-flex items-center justify-center uppercase tracking-[0.1em] text-[11px] px-5 py-2 transition hover:bg-[#0ABAB5] hover:text-black`}
              style={{ background: "#fff", color: "#000", borderRadius: 0, border: "none", cursor: "pointer" }}
              aria-label="Abrir contacto"
            >
              {CTA.label}
            </button>
          </nav>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center h-9 w-9 transition"
            style={{ color: "#fff" }}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            <span
              aria-hidden
              className={["leading-none transition-transform duration-200", open ? "text-[18px]" : "text-[20px]"].join(" ")}
            >
              {open ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </div>

      <MobileMenuSheet open={open} onClose={() => setOpen(false)} items={NAV_ITEMS} cta={CTA} />
    </header>
  );
}
