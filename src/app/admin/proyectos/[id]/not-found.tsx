import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <div className="flex flex-col items-start gap-4 py-20">
      <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--teal)]">
        Error 404
      </p>
      <h1 className="font-[family-name:var(--font-title)] text-4xl uppercase tracking-tight text-white">
        Proyecto no encontrado
      </h1>
      <p className="max-w-md text-sm text-white/60">
        El proyecto que buscás no existe o fue eliminado.
      </p>
      <Link
        href="/admin"
        className="border border-[var(--teal)] px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest text-[var(--teal)] no-underline transition hover:bg-[var(--teal)]/10"
      >
        ← Volver a proyectos
      </Link>
    </div>
  );
}
