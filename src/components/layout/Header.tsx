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
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-[color:var(--title)] no-underline"
        >
          Orbit Digital
        </Link>

        {/* Desktop: links a la derecha */}
        <nav className="hidden md:flex items-center gap-10">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} className="orbit-link text-sm">
              {item.label}
            </a>
          ))}
        </nav>

        {/* Mobile: hamburguesa a la derecha */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden rounded-lg border border-[color:var(--borderSoft)] px-3 py-2 text-sm text-[color:var(--title)] hover:bg-[color:var(--section)]"
          aria-label="Abrir menú"
          aria-expanded={open}
        >
          ☰
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden px-5 pb-4">
          <div className="rounded-xl border border-[color:var(--borderSoft)] bg-[color:var(--card)] p-2 shadow">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-sm text-[color:var(--title)] hover:bg-[color:var(--section)]"
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