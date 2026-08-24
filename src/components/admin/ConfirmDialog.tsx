"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AdminButton } from "@/components/admin/ui/AdminPrimitives";

const EASE = [0.22, 1, 0.36, 1] as const;

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  danger,
  loading,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm border border-[var(--teal)]/30 bg-[#0a3634] p-6"
          >
            <h2 className="font-[family-name:var(--font-title)] text-xl uppercase tracking-tight text-white">
              {title}
            </h2>
            {description && <p className="mt-2 text-sm text-white/60">{description}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <AdminButton variant="ghost" onClick={onCancel} disabled={loading}>
                {cancelLabel}
              </AdminButton>
              <AdminButton
                variant={danger ? "danger" : "primary"}
                onClick={onConfirm}
                disabled={loading}
              >
                {loading ? "..." : confirmLabel}
              </AdminButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
