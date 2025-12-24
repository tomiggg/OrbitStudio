"use client";

import { useEffect, useMemo, useState } from "react";

type ContactModalProps = {
  open: boolean;
  onClose: () => void;
  // opcional: si después querés prellenar (ej: viene desde “Elegir este servicio”)
  presetService?: string | null;
};

type BudgetRange = "No lo sé" | "USD 150–350" | "USD 350–800" | "USD 800–1500" | "USD 1500+";
type Timeline = "Esta semana" | "2–3 semanas" | "1 mes" | "Flexible";

export function ContactModal({ open, onClose, presetService = null }: ContactModalProps) {
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [whatsApp, setWhatsApp] = useState("");
  const [service, setService] = useState<string>(presetService ?? "");
  const [goal, setGoal] = useState("");
  const [timeline, setTimeline] = useState<Timeline>("2–3 semanas");
  const [budget, setBudget] = useState<BudgetRange>("No lo sé");
  const [refs, setRefs] = useState("");
  const [details, setDetails] = useState("");

  // Si viene un presetService después, lo reflejamos
// Sincronizar servicio seleccionado con el origen (carrusel / CTA)
useEffect(() => {
  setService(presetService ?? "");
}, [presetService]);

  useEffect(() => {
  if (!open) {
    setName("");
    setBusiness("");
    setWhatsApp("");
    setGoal("");
    setTimeline("2–3 semanas");
    setBudget("No lo sé");
    setRefs("");
    setDetails("");
    setService(presetService ?? "");
  }
}, [open, presetService]);

  // Cerrar con ESC + bloquear scroll del body
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  const canSend = useMemo(() => {
    return name.trim().length > 0 && goal.trim().length > 0;
  }, [name, goal]);

  function buildWhatsAppText() {
    const lines = [
      "Hola Orbit Digital 👋",
      "",
      `Nombre: ${name || "-"}`,
      `Negocio: ${business || "-"}`,
      `WhatsApp: ${whatsApp || "-"}`,
      `Servicio: ${service || "-"}`,
      `Objetivo: ${goal || "-"}`,
      `Plazo: ${timeline || "-"}`,
      `Presupuesto: ${budget || "-"}`,
      `Referencias: ${refs || "-"}`,
      "",
      "Detalles:",
      details || "-",
    ];
    return encodeURIComponent(lines.join("\n"));
  }

  function onSend() {
    // Reemplazá por tu número real (formato wa.me)
    const phone = "5493510000000";
    const href = `https://wa.me/${phone}?text=${buildWhatsAppText()}`;
    window.open(href, "_blank", "noreferrer");
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-black/45"
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl">
        <div
          className="
            overflow-hidden rounded-3xl
            border border-[color:var(--borderSoft)]
            bg-[color:var(--card)]
            shadow-[0_18px_60px_rgba(0,0,0,0.20)]
          "
          role="dialog"
          aria-modal="true"
          aria-label="Formulario de contacto"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-[color:var(--borderSoft)] px-6 py-5">
            <div>
              <div className="text-lg font-semibold text-[color:var(--title)]">
                Contanos tu proyecto
              </div>
              <p className="mt-1 text-sm text-[color:var(--muted)]">
                Te respondemos en el día. Sin compromiso.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-3 py-2 text-sm font-semibold text-[color:var(--muted)] hover:bg-[color:var(--section)]"
            >
              ✕
            </button>
          </div>

          {/* Body (scroll interno) */}
          <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
            <div className="grid gap-5">
              {/* Top grid */}
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-1 text-sm">
                  <span className="font-semibold text-[color:var(--title)]">Nombre *</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl border border-[color:var(--borderSoft)] bg-[color:var(--bg)] px-4 py-3 text-[color:var(--text)] outline-none focus:ring-2 focus:ring-[color:var(--ringSoft)]"
                    placeholder="Tu nombre"
                  />
                </label>

                <label className="grid gap-1 text-sm">
                  <span className="font-semibold text-[color:var(--title)]">WhatsApp (opcional)</span>
                  <input
                    value={whatsApp}
                    onChange={(e) => setWhatsApp(e.target.value)}
                    className="rounded-xl border border-[color:var(--borderSoft)] bg-[color:var(--bg)] px-4 py-3 text-[color:var(--text)] outline-none focus:ring-2 focus:ring-[color:var(--ringSoft)]"
                    placeholder="+54 9 ..."
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-1 text-sm">
                  <span className="font-semibold text-[color:var(--title)]">Negocio (opcional)</span>
                  <input
                    value={business}
                    onChange={(e) => setBusiness(e.target.value)}
                    className="rounded-xl border border-[color:var(--borderSoft)] bg-[color:var(--bg)] px-4 py-3 text-[color:var(--text)] outline-none focus:ring-2 focus:ring-[color:var(--ringSoft)]"
                    placeholder="Ej: Estudio, local, e-commerce..."
                  />
                </label>

                <label className="grid gap-1 text-sm">
                  <span className="font-semibold text-[color:var(--title)]">Servicio</span>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="rounded-xl border border-[color:var(--borderSoft)] bg-[color:var(--bg)] px-4 py-3 text-[color:var(--text)] outline-none focus:ring-2 focus:ring-[color:var(--ringSoft)]"
                  >
                    <option value="">No estoy seguro</option>
                    <option value="Landing Page Profesional">Landing Page Profesional</option>
                    <option value="Sitio Web Profesional">Sitio Web Profesional</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Web App / Sistema a medida">Web App / Sistema a medida</option>
                  </select>
                </label>
              </div>

              <label className="grid gap-1 text-sm">
                <span className="font-semibold text-[color:var(--title)]">Objetivo *</span>
                <input
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="rounded-xl border border-[color:var(--borderSoft)] bg-[color:var(--bg)] px-4 py-3 text-[color:var(--text)] outline-none focus:ring-2 focus:ring-[color:var(--ringSoft)]"
                  placeholder="Ej: conseguir consultas por WhatsApp, vender online, presentar mi empresa…"
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-1 text-sm">
                  <span className="font-semibold text-[color:var(--title)]">Plazo</span>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value as Timeline)}
                    className="rounded-xl border border-[color:var(--borderSoft)] bg-[color:var(--bg)] px-4 py-3 text-[color:var(--text)] outline-none focus:ring-2 focus:ring-[color:var(--ringSoft)]"
                  >
                    <option>Esta semana</option>
                    <option>2–3 semanas</option>
                    <option>1 mes</option>
                    <option>Flexible</option>
                  </select>
                </label>

                <label className="grid gap-1 text-sm">
                  <span className="font-semibold text-[color:var(--title)]">Presupuesto</span>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value as BudgetRange)}
                    className="rounded-xl border border-[color:var(--borderSoft)] bg-[color:var(--bg)] px-4 py-3 text-[color:var(--text)] outline-none focus:ring-2 focus:ring-[color:var(--ringSoft)]"
                  >
                    <option>No lo sé</option>
                    <option>USD 150–350</option>
                    <option>USD 350–800</option>
                    <option>USD 800–1500</option>
                    <option>USD 1500+</option>
                  </select>
                </label>
              </div>

              <label className="grid gap-1 text-sm">
                <span className="font-semibold text-[color:var(--title)]">Referencias (opcional)</span>
                <input
                  value={refs}
                  onChange={(e) => setRefs(e.target.value)}
                  className="rounded-xl border border-[color:var(--borderSoft)] bg-[color:var(--bg)] px-4 py-3 text-[color:var(--text)] outline-none focus:ring-2 focus:ring-[color:var(--ringSoft)]"
                  placeholder="Links de webs que te gustan (si tenés)"
                />
              </label>

              <label className="grid gap-1 text-sm">
                <span className="font-semibold text-[color:var(--title)]">Detalles (opcional)</span>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="min-h-[120px] resize-none rounded-xl border border-[color:var(--borderSoft)] bg-[color:var(--bg)] px-4 py-3 text-[color:var(--text)] outline-none focus:ring-2 focus:ring-[color:var(--ringSoft)]"
                  placeholder="Qué ofrecés, qué problema querés resolver, secciones que necesitás, etc."
                />
              </label>

              <p className="text-xs text-[color:var(--muted)]">
                * Campos obligatorios. Te respondemos con una propuesta clara del “primer paso”.
              </p>
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex flex-col gap-3 border-t border-[color:var(--borderSoft)] px-6 py-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-xl border border-[color:var(--borderSoft)] px-5 py-3 text-sm font-semibold text-[color:var(--title)] hover:bg-[color:var(--section)]"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={onSend}
              disabled={!canSend}
              className="inline-flex items-center justify-center rounded-xl bg-[color:var(--cta)] px-5 py-3 text-sm font-semibold text-white hover:bg-[color:var(--ctaHover)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Enviar por WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}