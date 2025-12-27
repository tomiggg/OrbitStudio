"use client";

import { useEffect, useMemo, useState } from "react";

type Opts = {
  startDelayMs?: number;
  lineDelayMs?: number;
  charMs?: number;
  repeatDelayMs?: number; // ✅ nuevo
};

export function useTypewriterLines(lines: string[], opts?: Opts) {
  const startDelayMs = opts?.startDelayMs ?? 450;
  const lineDelayMs = opts?.lineDelayMs ?? 280;
  const charMs = opts?.charMs ?? 28;
  const repeatDelayMs = opts?.repeatDelayMs ?? 0;

  const fullText = useMemo(() => lines.join("\n"), [lines]);

  const [i, setI] = useState(0);
  const [started, setStarted] = useState(false);
  const [cycle, setCycle] = useState(0); // ✅ nuevo

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), startDelayMs);
    return () => clearTimeout(t);
  }, [startDelayMs, cycle]); // ✅ importante: reinicia por ciclo

  useEffect(() => {
    if (!started) return;

    // terminó de tipear
    if (i >= fullText.length) {
      if (!repeatDelayMs) return;

      const t = setTimeout(() => {
        setI(0);
        setStarted(false);
        setCycle((c) => c + 1); // ✅ dispara nuevo ciclo
      }, repeatDelayMs);

      return () => clearTimeout(t);
    }

    const nextChar = fullText[i];
    const extraDelay = nextChar === "\n" ? lineDelayMs : 0;

    const t = setTimeout(() => setI((x) => x + 1), charMs + extraDelay);
    return () => clearTimeout(t);
  }, [started, i, fullText, charMs, lineDelayMs, repeatDelayMs]);

  const typed = fullText.slice(0, i);
  const typedLines = typed.split("\n");
  const done = i >= fullText.length;

  return { typedLines, done, cycle }; // ✅ devolvemos cycle
}