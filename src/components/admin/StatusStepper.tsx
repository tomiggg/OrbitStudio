"use client";

import { PROJECT_STATUS_LABEL, PROJECT_STATUS_ORDER } from "@/lib/admin/types";
import type { ProjectStatus } from "@/lib/admin/types";

export function StatusStepper({
  status,
  onChange,
}: {
  status: ProjectStatus;
  onChange?: (status: ProjectStatus) => void;
}) {
  const currentIndex = PROJECT_STATUS_ORDER.indexOf(status);
  const interactive = Boolean(onChange);

  return (
    <div className="flex w-full items-stretch">
      {PROJECT_STATUS_ORDER.map((step, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isLast = index === PROJECT_STATUS_ORDER.length - 1;

        return (
          <div key={step} className="flex flex-1 flex-col items-stretch">
            <div className="flex items-center">
              <button
                type="button"
                disabled={!interactive}
                onClick={() => onChange?.(step)}
                aria-current={isCurrent}
                className={`flex h-8 w-8 shrink-0 items-center justify-center border font-mono text-[11px] transition ${
                  isDone || isCurrent
                    ? "border-[var(--teal)] bg-[var(--teal)] text-[var(--dark)]"
                    : "border-[var(--teal)]/30 bg-transparent text-[var(--teal)]/40"
                } ${interactive ? "cursor-pointer hover:brightness-110" : "cursor-default"}`}
              >
                {index + 1}
              </button>
              {!isLast && (
                <div
                  className={`h-[1px] flex-1 ${
                    isDone ? "bg-[var(--teal)]" : "bg-[var(--teal)]/20"
                  }`}
                />
              )}
            </div>
            <span
              className={`mt-2 font-mono text-[9px] uppercase tracking-widest ${
                isDone || isCurrent ? "text-[var(--teal)]" : "text-[var(--teal)]/40"
              }`}
            >
              {PROJECT_STATUS_LABEL[step]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
