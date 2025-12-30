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
    // TODO: tu lógica real (WhatsApp / submit)
    // Por ahora solo cierra:
    setOpen(false);
  }

  const value = useMemo(
    () => ({ openContact, closeContact }),
    []
  );

  return (
    <ContactContext.Provider value={value}>
      {children}

      {/* Overlay se monta UNA vez (global) */}
      <ContactOverlay
        open={open}
        onClose={closeContact}
        title="Contacto"
        subtitle="Te respondemos en el día. Sin compromiso."
      >
        <ContactContent
          value={form}
          onChange={(patch) => setForm((p) => ({ ...p, ...patch }))}
          onClose={closeContact}
          onSend={onSend}
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