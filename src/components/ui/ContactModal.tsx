"use client";

import { useEffect, useMemo, useState } from "react";
import { ContactOverlay } from "@/components/ui/ContactOverlay";
import {
  ContactContent,
  ContactFormState,
  BudgetRange,
  Timeline,
} from "@/components/ui/ContactContent";

type ContactModalProps = {
  open: boolean;
  onClose: () => void;
  presetService?: string | null;
};

const DEFAULT_FORM: ContactFormState = {
  name: "",
  business: "",
  whatsApp: "",
  service: "",
  goal: "",
  timeline: "2–3 semanas",
  budget: "No lo sé",
  refs: "",
  details: "",
};

export function ContactModal({
  open,
  onClose,
  presetService = null,
}: ContactModalProps) {
  const [form, setForm] = useState<ContactFormState>({
    ...DEFAULT_FORM,
    service: presetService ?? "",
  });

  // Sync preset service
  useEffect(() => {
    setForm((prev) => ({ ...prev, service: presetService ?? "" }));
  }, [presetService]);

  // Reset al cerrar
  useEffect(() => {
    if (open) return;
    setForm({ ...DEFAULT_FORM, service: presetService ?? "" });
  }, [open, presetService]);

  const canSend = useMemo(() => {
    return form.name.trim().length > 0 && form.goal.trim().length > 0;
  }, [form.name, form.goal]);

  function buildWhatsAppText() {
    const lines = [
      "Hola Orbit Digital 👋",
      "",
      `Nombre: ${form.name || "-"}`,
      `Negocio: ${form.business || "-"}`,
      `WhatsApp: ${form.whatsApp || "-"}`,
      `Servicio: ${form.service || "-"}`,
      `Objetivo: ${form.goal || "-"}`,
      `Plazo: ${form.timeline || "-"}`,
      `Presupuesto: ${form.budget || "-"}`,
      `Referencias: ${form.refs || "-"}`,
      "",
      "Detalles:",
      form.details || "-",
    ];
    return encodeURIComponent(lines.join("\n"));
  }

  function onSend() {
    const phone = "5493512261334";
    const href = `https://wa.me/${phone}?text=${buildWhatsAppText()}`;
    window.open(href, "_blank", "noreferrer");
  }

  return (
    <ContactOverlay
      open={open}
      onClose={onClose}
      title="Contanos tu proyecto"
      subtitle={undefined}
    >
      <ContactContent
        value={form}
        onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
        onClose={onClose}
        onSend={onSend}
        canSend={canSend}
      />
    </ContactOverlay>
  );
}