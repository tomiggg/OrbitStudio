import type { ReactNode } from "react";

export function PortalShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[color:var(--dark)] text-[color:var(--white)]">
      <header className="border-b border-[color:rgba(250,252,252,0.12)] px-6 py-4">
        <span className="font-title text-lg uppercase tracking-[-0.02em] text-[color:var(--white)]">
          Shift Studio
        </span>
        <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--teal)]">
          / Portal cliente
        </span>
      </header>
      <main className="mx-auto max-w-[760px] px-6 py-10">{children}</main>
    </div>
  );
}
