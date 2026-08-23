"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { logout } from "@/lib/admin/auth";

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.replace("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[color:var(--dark)] text-[color:var(--white)]">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[color:rgba(250,252,252,0.12)] bg-[color:var(--dark)] px-6 py-4">
        <Link href="/admin" className="no-underline hover:no-underline">
          <span className="font-title text-lg uppercase tracking-[-0.02em] text-[color:var(--white)]">
            Shift Studio
          </span>
          <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--teal)]">
            / Panel
          </span>
        </Link>
        <nav className="flex items-center gap-5 font-mono text-[11px] uppercase tracking-[0.15em]">
          <Link
            href="/admin"
            className={`no-underline hover:text-[color:var(--teal)] ${
              pathname === "/admin" ? "text-[color:var(--teal)]" : "text-[color:rgba(250,252,252,0.6)]"
            }`}
          >
            Proyectos
          </Link>
          <Link
            href="/admin/proyectos/nuevo"
            className={`no-underline hover:text-[color:var(--teal)] ${
              pathname === "/admin/proyectos/nuevo" ? "text-[color:var(--teal)]" : "text-[color:rgba(250,252,252,0.6)]"
            }`}
          >
            + Nuevo
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="border border-[color:rgba(250,252,252,0.25)] bg-transparent px-3 py-1.5 text-[color:rgba(250,252,252,0.6)] hover:border-[color:var(--teal)] hover:text-[color:var(--teal)]"
          >
            Salir
          </button>
        </nav>
      </header>
      <main className="mx-auto max-w-[1200px] px-6 py-10">{children}</main>
    </div>
  );
}
