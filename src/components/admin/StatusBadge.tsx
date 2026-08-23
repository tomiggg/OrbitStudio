import { STATUS_META } from "@/lib/admin/stages";
import type { ProjectStatus } from "@/lib/admin/types";

const TONE_CLASS: Record<string, string> = {
  teal: "border-[color:var(--teal)] text-[color:var(--teal)]",
  muted: "border-[color:rgba(250,252,252,0.35)] text-[color:rgba(250,252,252,0.55)]",
  done: "border-[color:var(--white)] text-[color:var(--white)] bg-[color:var(--teal)]",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-2 border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] ${TONE_CLASS[meta.tone]}`}
    >
      <span className="h-1.5 w-1.5" style={{ background: "currentColor" }} />
      {meta.label}
    </span>
  );
}
