import Link from "next/link";
import { getCurrentAdminName } from "@/lib/admin/currentAdmin";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { ToastProvider } from "@/components/admin/Toaster";
import { jakarta } from "@/components/admin/fonts";

export const metadata = {
  title: "Admin — Shift Studio",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const adminName = await getCurrentAdminName();

  return (
    <div className="min-h-screen bg-[var(--ink)] text-white">
      <header className="border-b border-[var(--sky)]/20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/admin" className="flex items-baseline gap-2 no-underline">
            <span className={`${jakarta.className} text-lg tracking-tight text-white`}>
              Shift Studio
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--sky)]">
              / admin
            </span>
          </Link>
          {adminName && (
            <nav className="flex items-center gap-5 font-mono text-[11px] uppercase tracking-widest text-[var(--sky)]">
              <Link href="/admin" className="no-underline hover:text-white">
                Proyectos
              </Link>
              <span className="text-white/40">Sesión: {adminName}</span>
              <LogoutButton />
            </nav>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">
        <ToastProvider>{children}</ToastProvider>
      </main>
    </div>
  );
}
