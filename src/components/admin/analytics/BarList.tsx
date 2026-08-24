import { AdminCard, AdminLabel } from "@/components/admin/ui/AdminPrimitives";
import { formatLabel } from "@/lib/analytics/format";
import type { Count } from "@/lib/analytics/queries";

// Comparación de magnitud → un solo hue secuencial (sky), track más
// claro del mismo ramp, dato en la punta. Sin paleta categórica: cada
// fila ya se distingue por su label, el color no está cargando
// identidad acá — ver skill de dataviz, tabla "choosing-a-form".
export function BarList({
  title,
  items,
  emptyLabel = "Sin datos todavía",
}: {
  title: string;
  items: Count[];
  emptyLabel?: string;
}) {
  const max = items.reduce((m, i) => Math.max(m, i.count), 0) || 1;

  return (
    <AdminCard className="flex flex-col gap-3 p-4">
      <AdminLabel>{title}</AdminLabel>
      {items.length === 0 ? (
        <p className="py-4 text-center text-xs text-white/30">{emptyLabel}</p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {items.map((item) => {
            const pct = Math.max((item.count / max) * 100, 4);
            return (
              <li key={item.label} className="flex items-center gap-3">
                <span className="w-28 shrink-0 truncate text-xs text-white/70" title={item.label}>
                  {formatLabel(item.label)}
                </span>
                <span className="h-2.5 flex-1 overflow-hidden bg-[var(--sky)]/10">
                  <span
                    className="block h-full bg-[var(--sky)]"
                    style={{ width: `${pct}%`, borderRadius: "0 4px 4px 0" }}
                  />
                </span>
                <span className="w-10 shrink-0 text-right font-mono text-[11px] text-white/50">
                  {item.count}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </AdminCard>
  );
}
