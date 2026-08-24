import { Logo } from "@/components/ui/Logo";

export default function PortalNotFound() {
  return (
    <div className="min-h-screen bg-[var(--dark)] text-white">
      <header className="border-b border-[var(--teal)]/20">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Logo variant="wordmark" theme="dark" size={26} />
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--teal)]">
            Portal cliente
          </span>
        </div>
      </header>
      <main className="mx-auto flex max-w-3xl flex-col items-start gap-4 px-5 py-16">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--teal)]">
          404 · Link inválido
        </p>
        <h1 className="font-[family-name:var(--font-title)] text-3xl uppercase tracking-tight text-white">
          No encontramos este proyecto
        </h1>
        <p className="max-w-md text-sm text-white/60">
          Revisá que el link esté completo, o pedile a Shift Studio que te lo
          reenvíe.
        </p>
      </main>
    </div>
  );
}
