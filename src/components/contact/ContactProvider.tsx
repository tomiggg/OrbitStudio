"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { ContactOverlay } from "@/components/ui/ContactOverlay";
import { ContactContent, ContactFormState } from "@/components/ui/ContactContent";

type ContactCtx = {
  openContact: () => void;
  closeContact: () => void;
};

const ContactContext = createContext<ContactCtx | null>(null);

const initialForm: ContactFormState = {
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

export function ContactProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ContactFormState>(initialForm);

  const canSend = useMemo(() => {
    return form.name.trim().length > 0 && form.goal.trim().length > 0;
  }, [form.name, form.goal]);

  function openContact() {
    setOpen(true);
  }

  function closeContact() {
    setOpen(false);
    // si querés resetear al cerrar:
    // setForm(initialForm);
  }

  function onSend() {
    const lines = [
      "Hola Shift Studio 👋",
      "",
      `Nombre: ${form.name || "-"}`,
      `Negocio: ${form.business || "-"}`,
      `¿Qué necesitás?: ${form.service || "-"}`,
      `Objetivo: ${form.goal || "-"}`,
    ];
    const text = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/5493512261334?text=${text}`, "_blank", "noreferrer");
  }

  function onSendEmail() {
    const subject = encodeURIComponent("Consulta desde Shift Studio");
    const body = encodeURIComponent(
      [
        `Nombre: ${form.name || "-"}`,
        `Negocio: ${form.business || "-"}`,
        `¿Qué necesitás?: ${form.service || "-"}`,
        `Objetivo: ${form.goal || "-"}`,
      ].join("\n")
    );
    window.open(
      `mailto:shiftstudio.work@gmail.com?subject=${subject}&body=${body}`,
      "_blank",
      "noreferrer"
    );
  }

  const value = useMemo(
    () => ({ openContact, closeContact }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <ContactContext.Provider value={value}>
      {children}

      <ContactOverlay open={open} onClose={closeContact}>
        <ContactContent
          value={form}
          onChange={(patch) => setForm((p) => ({ ...p, ...patch }))}
          onClose={closeContact}
          onSend={onSend}
          onSendEmail={onSendEmail}
          canSend={canSend}
        />
      </ContactOverlay>
    </ContactContext.Provider>
  );
}

export function useContact() {
  const ctx = useContext(ContactContext);
  if (!ctx) throw new Error("useContact must be used within ContactProvider");
  return ctx;
}