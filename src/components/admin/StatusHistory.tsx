import { PROJECT_STATUS_LABEL } from "@/lib/admin/types";
import type { StatusChange } from "@/lib/admin/types";
import { ClientDate } from "@/components/admin/ClientDate";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function StatusHistory({ history }: { history: StatusChange[] }) {
  const ordered = [...history].reverse();

  return (
    <ol className="flex flex-col gap-3">
      {ordered.map((entry, i) => (
        <li key={`${entry.status}-${entry.changedAt}`} className="flex items-start gap-3">
          <span
            className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
              i === 0 ? "bg-[var(--sky)]" : "bg-white/20"
            }`}
          />
          <div className="flex flex-col">
            <span
              className={`font-mono text-[11px] uppercase tracking-widest ${
                i === 0 ? "text-[var(--sky)]" : "text-white/50"
              }`}
            >
              {PROJECT_STATUS_LABEL[entry.status]}
            </span>
            <ClientDate
              iso={entry.changedAt}
              format={formatDateTime}
              className="font-mono text-[9px] text-white/30"
            />
          </div>
        </li>
      ))}
    </ol>
  );
}
