import { Logo } from "@/components/ui/Logo";

export default function PortalNotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--dark)] text-white">
      <header className="border-b border-[var(--teal)]/20">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Logo variant="wordmark" theme="dark" size={26} />
        </div>
      </header>
      <main className="mx-auto flex max-w-3xl flex-1 flex-col items-start justify-center gap-4 px-5 py-16">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--teal)]">
          Error 404
        </p>
        <h1 className="font-[family-name:var(--font-title)] text-4xl uppercase tracking-tight text-white">
          Link inválido
        </h1>
        <p className="max-w-md text-sm text-white/60">
          Este link de portal no corresponde a ningún proyecto activo.
          Revisá el link o pedile a Shift Studio que te reenvíe el acceso.
        </p>
      </main>
    </div>
  );
}
