import { PROJECT_STATUS_LABEL } from "@/lib/admin/types";
import type { StatusChange } from "@/lib/admin/types";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function StatusHistory({ history }: { history: StatusChange[] }) {
  const ordered = [...history].reverse();

  return (
    <ol className="flex flex-col gap-3">
      {ordered.map((entry, index) => (
        <li key={`${entry.status}-${entry.changedAt}`} className="flex items-start gap-3">
          <div className="mt-1 flex flex-col items-center">
            <span
              className={`h-2 w-2 shrink-0 ${
                index === 0 ? "bg-[var(--teal)]" : "bg-[var(--teal)]/40"
              }`}
            />
            {index !== ordered.length - 1 && (
              <span className="mt-1 h-6 w-px bg-[var(--teal)]/20" />
            )}
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-white">
              {PROJECT_STATUS_LABEL[entry.status]}
            </p>
            <p className="font-mono text-[10px] text-white/40">
              {formatDateTime(entry.changedAt)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
