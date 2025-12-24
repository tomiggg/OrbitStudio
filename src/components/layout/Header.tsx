"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { href: "#services", label: "Servicios" },
  { href: "#portfolio", label: "Proyectos" },
  { href: "#process", label: "Proceso" },
  { href: "#contact", label: "Contacto" },
];

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
      {/* Full-width tinted glass band */}
<div
  className="
    relative
    bg-[linear-gradient(
      180deg,
      rgba(11,66,94,0.68)
      rgba(11,66,94,0.50)
    )]
    backdrop-blur-2xl
    shadow-[0_12px_36px_rgba(0,0,0,0.18)]
  "
>
        {/* subtle highlight */}
<div
  aria-hidden="true"
  className="
    pointer-events-none absolute inset-0
    bg-[linear-gradient(
      180deg,
      rgba(255,255,255,0.18),
      rgba(255,255,255,0.02)
    )]
  "
/>

        {/* inner container */}
        <div className="relative mx-auto flex h-14 w-full max-w-[1100px] items-center justify-between px-5 md:h-16 md:px-8">
          {/* Logo (bounded, no crop) */}
          <Link
            href="/"
            className="flex items-center no-underline"
            aria-label="Orbit Digital"
          >
            <img
              src="/logo/orbit-logo-header.png"
              alt="Orbit Digital"
              loading="eager"
              className="
                block
                h-auto w-auto
                max-h-8 md:max-h-10
                max-w-[140px] md:max-w-[180px]
                object-contain
              "
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-10 md:flex">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="
                  text-sm font-semibold
                  text-[color:var(--title)]
                  opacity-90
                  no-underline
                  transition
                  hover:opacity-100
                "
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="
              md:hidden
              rounded-xl
              bg-white/10
              px-3 py-2
              text-sm font-semibold
              text-[color:var(--title)]
              opacity-90
              backdrop-blur
              transition
              hover:bg-white/14
              hover:opacity-100
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
              <div className="mt-3 rounded-2xl bg-white/10 backdrop-blur-xl p-2 shadow-[0_10px_25px_rgba(0,0,0,0.12)]">
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="
                      block rounded-xl px-3 py-2
                      text-sm font-semibold
                      text-[color:var(--title)]
                      opacity-90
                      no-underline
                      transition
                      hover:bg-white/10
                      hover:opacity-100
                    "
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}