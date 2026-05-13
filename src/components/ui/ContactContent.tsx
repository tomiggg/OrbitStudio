"use client";

import { useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "800" });

export type BudgetRange =
  | "No lo sé"
  | "USD 150–350"
  | "USD 350–800"
  | "USD 800–1500"
  | "USD 1500+";

export type Timeline = "Esta semana" | "2–3 semanas" | "1 mes" | "Flexible";

export type ContactFormState = {
  name: string;
  business: string;
  whatsApp: string;
  service: string;
  goal: string;
  timeline: Timeline;
  budget: BudgetRange;
  refs: string;
  details: string;
};

type Props = {
  value: ContactFormState;
  onChange: (patch: Partial<ContactFormState>) => void;
  onClose: () => void;
  onSend: () => void;
  onSendEmail: () => void;
  canSend: boolean;
};

const inputClass =
  "w-full rounded-lg text-[13px] text-black outline-none transition-[border-color,background] duration-200 placeholder:text-[rgba(7,43,42,0.35)] focus:border-[rgba(10,186,181,0.4)] focus:bg-[rgba(10,186,181,0.04)]";

const inputStyle = {
  padding: "12px 14px",
  background: "rgba(7,43,42,0.05)",
  border: "1px solid transparent",
  fontFamily: "var(--font-body)",
};

type SendMethod = "whatsapp" | "email";

export function ContactContent({ value, onChange, onClose: _, onSend, onSendEmail, canSend }: Props) {
  const [sendMethod, setSendMethod] = useState<SendMethod>("whatsapp");

  function handleSend() {
    if (sendMethod === "email") {
      onSendEmail();
    } else {
      onSend();
    }
  }

  return (
    <div style={{ width: "100%" }}>

      {/* Title */}
      <h2
        className={plusJakarta.className}
        style={{
          fontSize: "clamp(32px, 5vw, 44px)",
          color: "#000",
          lineHeight: 0.85,
          letterSpacing: "-0.03em",
          textTransform: "none",
          marginBottom: "32px",
        }}
      >
        ¿Tenés un proyecto
        <br />
        en mente?
      </h2>

      {/* Fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

        <Field label="Tu nombre *">
          <input
            type="text"
            value={value.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className={inputClass}
            style={inputStyle}
            placeholder="Nombre"
          />
        </Field>

        <Field label="¿Cuál es tu negocio?">
          <input
            type="text"
            value={value.business}
            onChange={(e) => onChange({ business: e.target.value })}
            className={inputClass}
            style={inputStyle}
            placeholder="Ej: inmobiliaria, ecommerce, estudio..."
          />
        </Field>

        <Field label="¿Qué necesitás?">
          <input
            type="text"
            value={value.service}
            onChange={(e) => onChange({ service: e.target.value })}
            className={inputClass}
            style={inputStyle}
            placeholder="Ej: web, branding, sistema a medida..."
          />
        </Field>

        <Field label="Objetivo principal *">
          <textarea
            value={value.goal}
            onChange={(e) => onChange({ goal: e.target.value })}
            className={inputClass}
            style={{ ...inputStyle, resize: "none" }}
            placeholder="Contanos qué problema querés resolver..."
            rows={3}
          />
        </Field>

      </div>

      {/* Divider */}
      <div style={{ margin: "24px 0 0", height: "1px", background: "rgba(7,43,42,0.07)" }} />

      {/* Send method switch */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            color: "rgba(7,43,42,0.45)",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            flexShrink: 0,
          }}
        >
          Enviar por
        </span>

        <div
          style={{
            display: "flex",
            border: "1px solid rgba(7,43,42,0.12)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {(["whatsapp", "email"] as SendMethod[]).map((method, i) => (
            <button
              key={method}
              type="button"
              onClick={() => setSendMethod(method)}
              style={{
                padding: "8px 18px",
                background: sendMethod === method ? "#000" : "transparent",
                color: sendMethod === method ? "#fff" : "rgba(7,43,42,0.45)",
                border: "none",
                borderLeft: i === 1 ? "1px solid rgba(7,43,42,0.12)" : "none",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                transition: "background 0.2s, color 0.2s",
              }}
            >
              {method === "whatsapp" ? "WhatsApp" : "Email"}
            </button>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>

        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          className={plusJakarta.className}
          style={{
            width: "100%",
            padding: "16px",
            background: "#000",
            color: "#fff",
            fontSize: "15px",
            borderRadius: "10px",
            border: "none",
            cursor: canSend ? "pointer" : "not-allowed",
            opacity: canSend ? 1 : 0.4,
            transition: "opacity 0.2s",
            textTransform: "none",
          }}
        >
          {sendMethod === "whatsapp" ? "Enviar por WhatsApp" : "Enviar por Email"}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(7,43,42,0.08)" }} />
          <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(7,43,42,0.3)" }}>o</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(7,43,42,0.08)" }} />
        </div>

        <button
          type="button"
          onClick={() =>
            window.open(
              "https://wa.me/5493512261334?text=" +
                encodeURIComponent("Hola Shift Studio, quiero agendar una llamada"),
              "_blank",
              "noreferrer"
            )
          }
          className={plusJakarta.className}
          style={{
            width: "100%",
            padding: "14px",
            background: "transparent",
            color: "rgba(7,43,42,0.7)",
            fontSize: "14px",
            borderRadius: "10px",
            border: "1px solid rgba(7,43,42,0.2)",
            cursor: "pointer",
            transition: "border-color 0.2s",
            textTransform: "none",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(7,43,42,0.4)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(7,43,42,0.2)")}
        >
          Agenda una llamada
        </button>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "10px",
            color: "rgba(7,43,42,0.3)",
            textAlign: "center",
            marginTop: "8px",
          }}
        >
          Al enviar aceptás nuestros Términos y Política de Privacidad
        </p>

      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "12px",
          color: "rgba(7,43,42,0.6)",
          fontWeight: 600,
          marginBottom: "4px",
          display: "block",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
