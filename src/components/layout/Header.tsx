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
    <header className="sticky top-0 z-50 border-b border-[color:var(--borderSoft)] bg-[color:var(--bg)]/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-5 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <img
            src="/logo/orbit-logo-header.png"
            alt="Orbit Digital"
            className="h-7 w-auto"
            loading="eager"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-10 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="orbit-nav-link text-sm font-semibold/90 no-underline"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden rounded-lg border border-[color:var(--borderSoft)] px-3 py-2 text-sm font-semibold text-[color:var(--title)] hover:bg-[color:var(--section)]"
          aria-label="Abrir menú"
          aria-expanded={open}
        >
          ☰
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="px-5 pb-4 md:hidden">
          <div className="rounded-xl border border-[color:var(--borderSoft)] bg-[color:var(--card)] p-2 shadow-[0_10px_25px_rgba(0,0,0,0.06)]">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="orbit-nav-link block rounded-lg px-3 py-2 text-sm no-underline hover:bg-[color:var(--section)]"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}