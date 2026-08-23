import type { AttachmentMeta } from "@/lib/admin/types";
import { formatDateTime } from "@/lib/admin/format";

function kindLabel(kind: AttachmentMeta["kind"]) {
  switch (kind) {
    case "image":
      return "IMG";
    case "pdf":
      return "PDF";
    case "doc":
      return "DOC";
    default:
      return "ARCHIVO";
  }
}

export function AttachmentList({ attachments }: { attachments: AttachmentMeta[] }) {
  if (attachments.length === 0) {
    return (
      <p className="font-mono text-[11px] uppercase tracking-wide text-[color:rgba(250,252,252,0.4)]">
        Sin archivos adjuntos.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {attachments.map((att) => {
        const content = (
          <>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-[color:rgba(250,252,252,0.2)] font-mono text-[9px] text-[color:var(--teal)]">
              {kindLabel(att.kind)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm text-[color:var(--white)]">{att.name}</span>
              <span className="block font-mono text-[10px] uppercase tracking-wide text-[color:rgba(250,252,252,0.4)]">
                {att.sizeLabel} · {formatDateTime(att.uploadedAt)} · {att.uploadedBy === "admin" ? "Shift Studio" : "Cliente"}
              </span>
            </span>
          </>
        );

        return (
          <li key={att.id} className="border border-[color:rgba(250,252,252,0.12)]">
            {att.dataUrl ? (
              <a
                href={att.dataUrl}
                download={att.name}
                className="flex items-center gap-3 px-3 py-2.5 no-underline hover:bg-[color:rgba(10,186,181,0.08)]"
              >
                {content}
              </a>
            ) : (
              <div className="flex items-center gap-3 px-3 py-2.5">{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
