"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { isAuthed } from "@/lib/admin/auth";
import { useMounted } from "@/hooks/useMounted";

export function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const mounted = useMounted();
  const authed = mounted && isAuthed();

  useEffect(() => {
    if (mounted && !authed) {
      router.replace("/admin/login");
    }
  }, [mounted, authed, router]);

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--dark)]">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[color:rgba(250,252,252,0.4)]">
          Verificando sesión…
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
