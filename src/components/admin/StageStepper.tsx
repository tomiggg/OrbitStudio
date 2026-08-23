"use client";

import { STAGE_META, STAGE_ORDER, stageIndex } from "@/lib/admin/stages";
import type { ProjectStage } from "@/lib/admin/types";
import { formatDate } from "@/lib/admin/format";
import type { StageEvent } from "@/lib/admin/types";

type StageStepperProps = {
  stage: ProjectStage;
  history: StageEvent[];
  onSelectStage?: (stage: ProjectStage) => void;
};

export function StageStepper({ stage, history, onSelectStage }: StageStepperProps) {
  const currentIdx = stageIndex(stage);
  const interactive = Boolean(onSelectStage);

  return (
    <ol className="flex flex-col divide-y divide-[color:rgba(250,252,252,0.12)] border border-[color:rgba(250,252,252,0.12)]">
      {STAGE_ORDER.map((s, idx) => {
        const meta = STAGE_META[s];
        const done = idx < currentIdx;
        const active = idx === currentIdx;
        const entry = history.find((h) => h.stage === s);

        return (
          <li key={s}>
            <button
              type="button"
              disabled={!interactive}
              onClick={interactive ? () => onSelectStage?.(s) : undefined}
              className={`flex w-full items-center gap-4 border-0 bg-transparent px-4 py-3 text-left transition-colors ${
                interactive ? "cursor-pointer hover:bg-[color:rgba(10,186,181,0.08)]" : "cursor-default"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center border font-mono text-[11px] ${
                  active
                    ? "border-[color:var(--teal)] bg-[color:var(--teal)] text-[color:var(--dark)]"
                    : done
                      ? "border-[color:var(--teal)] text-[color:var(--teal)]"
                      : "border-[color:rgba(250,252,252,0.25)] text-[color:rgba(250,252,252,0.4)]"
                }`}
              >
                {meta.code}
              </span>
              <span className="flex-1">
                <span
                  className={`block font-mono text-[11px] uppercase tracking-[0.15em] ${
                    active || done ? "text-[color:var(--white)]" : "text-[color:rgba(250,252,252,0.45)]"
                  }`}
                >
                  {meta.label}
                </span>
                {entry ? (
                  <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-wide text-[color:rgba(250,252,252,0.4)]">
                    {formatDate(entry.enteredAt)}
                    {entry.note ? ` · ${entry.note}` : ""}
                  </span>
                ) : null}
              </span>
              {active ? (
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[color:var(--teal)]">
                  Actual
                </span>
              ) : null}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
