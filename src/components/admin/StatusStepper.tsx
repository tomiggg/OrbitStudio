"use client";

import { motion } from "framer-motion";
import { PROJECT_STATUS_LABEL, PROJECT_STATUS_ORDER } from "@/lib/admin/types";
import type { ProjectStatus } from "@/lib/admin/types";

const EASE = [0.22, 1, 0.36, 1] as const;

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
              <motion.button
                type="button"
                disabled={!interactive}
                onClick={() => onChange?.(step)}
                aria-current={isCurrent}
                animate={{
                  backgroundColor: isDone || isCurrent ? "var(--teal)" : "rgba(10,186,181,0)",
                  borderColor: isDone || isCurrent ? "var(--teal)" : "rgba(10,186,181,0.3)",
                  color: isDone || isCurrent ? "var(--dark)" : "rgba(10,186,181,0.4)",
                }}
                transition={{ duration: 0.35, ease: EASE }}
                className={`flex h-8 w-8 shrink-0 items-center justify-center border font-mono text-[11px] ${
                  interactive ? "cursor-pointer hover:brightness-110" : "cursor-default"
                }`}
              >
                {index + 1}
              </motion.button>
              {!isLast && (
                <div className="relative h-[1px] flex-1 overflow-hidden bg-[var(--teal)]/20">
                  <motion.div
                    className="absolute inset-y-0 left-0 w-full bg-[var(--teal)]"
                    style={{ transformOrigin: "left" }}
                    initial={false}
                    animate={{ scaleX: isDone ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  />
                </div>
              )}
            </div>
            <span
              className={`mt-2 font-mono text-[9px] uppercase tracking-widest transition-colors duration-300 ${
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
