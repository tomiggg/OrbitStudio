"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

type ToastKind = "success" | "error" | "info";
type ToastItem = { id: string; message: string; kind: ToastKind };

const ToastContext = createContext<((message: string, kind?: ToastKind) => void) | null>(null);

const EASE = [0.22, 1, 0.36, 1] as const;

const KIND_STYLES: Record<ToastKind, string> = {
  success: "border-[var(--teal)] bg-[var(--teal)] text-[var(--dark)]",
  error: "border-red-500 bg-red-500/90 text-white",
  info: "border-white/20 bg-[#0a3634] text-white",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const push = useCallback((message: string, kind: ToastKind = "info") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.25, ease: EASE }}
              className={`pointer-events-auto max-w-xs border px-4 py-3 font-mono text-[11px] uppercase tracking-widest ${KIND_STYLES[t.kind]}`}
            >
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>.");
  return ctx;
}
