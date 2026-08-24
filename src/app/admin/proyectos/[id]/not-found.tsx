import Link from "next/link";
import { AdminButton } from "@/components/admin/ui/AdminPrimitives";
import { jakarta } from "@/components/admin/fonts";

export default function AdminProjectNotFound() {
  return (
    <div className="flex flex-col items-start gap-4 py-16">
      <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--sky)]">
        404
      </p>
      <h1
        className={`${jakarta.className} text-3xl tracking-[-0.02em] text-white`}
        style={{ textTransform: "none" }}
      >
        Proyecto no encontrado
      </h1>
      <p className="max-w-md text-sm text-white/60">
        El proyecto que buscás no existe o fue eliminado. Puede que el link esté
        desactualizado.
      </p>
      <Link href="/admin">
        <AdminButton variant="ghost">← Volver a proyectos</AdminButton>
      </Link>
    </div>
  );
}
