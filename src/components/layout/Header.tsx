"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Glass band (sin tinte, blur real, sin línea inferior) */}
      <div
        className="
          relative
          bg-white/40
          backdrop-blur-2xl
          shadow-[0_10px_30px_rgba(0,0,0,0.10)]
        "
      >
        {/* highlight suave */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute inset-0
            bg-[linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,255,255,0.08))]
        "
        />
        {/* borde sutil (no “línea negra”) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/35"
        />

        <div className="relative mx-auto flex h-14 w-full max-w-[1100px] items-center justify-between px-5 md:h-16 md:px-8">
          <Link href="/" className="flex items-center no-underline" aria-label="Orbit Digital">
            <img
              src="/logo/orbit-logo-header.png"
              alt="Orbit Digital"
              loading="eager"
              className="block h-auto w-auto max-h-8 md:max-h-10 max-w-[140px] md:max-w-[180px] object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-10 md:flex">
            {NAV_ITEMS.map((item) => (
              <a key={item.href} href={item.href} className={linkBase}>
                {item.label}
              </a>
            ))}

            <a href={CTA.href} className={ctaPill}>
              {CTA.label}
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="
              md:hidden
              inline-flex items-center justify-center
              rounded-xl
              border border-black/10
              bg-white/30
              backdrop-blur-xl
              px-3 py-2
              text-sm font-semibold
              text-[color:var(--title)]/90
              shadow-[0_10px_20px_rgba(0,0,0,0.08)]
              transition
              hover:bg-white/40
            "
            aria-label="Abrir menú"
            aria-expanded={open}
          >
            ☰
          </button>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="md:hidden">
            <div className="mx-auto w-full max-w-[1100px] px-5 pb-4 md:px-8">
              <div
                className="
                  mt-3 rounded-2xl
                  border border-black/10
                  bg-white/30
                  backdrop-blur-2xl
                  p-2
                  shadow-[0_14px_30px_rgba(0,0,0,0.12)]
                "
              >
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="
                      block rounded-xl px-3 py-2
                      text-sm font-semibold
                      text-[color:var(--title)]/90
                      no-underline
                      transition
                      hover:bg-black/5
                    "
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}

                <a href={CTA.href} className={`mt-2 ${ctaPill} w-full`} onClick={() => setOpen(false)}>
                  {CTA.label}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}