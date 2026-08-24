"use client";

import { useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics/track";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "800" });
const plusJakartaBody = Plus_Jakarta_Sans({ subsets: ["latin"], weight: "400" });

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

type SendMethod = "whatsapp" | "email";

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "transparent",
  border: "none",
  color: "#0d0d0d",
  fontSize: "15px",
  outline: "none",
  padding: 0,
};

const rowSep: React.CSSProperties = {
  height: "1px",
  background: "rgba(0,0,0,0.07)",
  marginLeft: "16px",
};

const groupStyle: React.CSSProperties = {
  background: "rgba(0,0,0,0.05)",
  marginBottom: "16px",
  borderRadius: "12px",
  overflow: "hidden",
};

export function ContactContent({ value, onChange, onClose: _onClose, onSend, onSendEmail, canSend }: Props) {
  const [sendMethod, setSendMethod] = useState<SendMethod>("whatsapp");

  function handleSend() {
    track(ANALYTICS_EVENTS.contactSubmit, {
      method: sendMethod,
      service: value.service || undefined,
      timeline: value.timeline,
      budget: value.budget,
    });
    if (sendMethod === "email") onSendEmail(); else onSend();
  }

  return (
    <div style={{ width: "100%" }}>

      {/* Title */}
      <h2
        className={plusJakarta.className}
        style={{
          fontSize: "clamp(26px, 6vw, 34px)",
          color: "#0d0d0d",
          lineHeight: 0.9,
          letterSpacing: "-0.04em",
          marginBottom: "28px",
          textTransform: "none",
        }}
      >
        ¿Tenés un proyecto<br />
        <em style={{ fontStyle: "italic", color: "#9EC7D4" }}>en mente?</em>
      </h2>

      {/* Group 1: contact info */}
      <div style={groupStyle}>
        <FormRow label="Tu nombre *">
          <input
            type="text"
            value={value.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className={plusJakartaBody.className}
            placeholder="Nombre"
            style={inputStyle}
          />
        </FormRow>
        <div style={rowSep} />
        <FormRow label="¿Cuál es tu negocio?">
          <input
            type="text"
            value={value.business}
            onChange={(e) => onChange({ business: e.target.value })}
            className={plusJakartaBody.className}
            placeholder="Inmobiliaria, ecommerce, estudio..."
            style={inputStyle}
          />
        </FormRow>
        <div style={rowSep} />
        <FormRow label="¿Qué necesitás?">
          <input
            type="text"
            value={value.service}
            onChange={(e) => onChange({ service: e.target.value })}
            className={plusJakartaBody.className}
            placeholder="Web, branding, sistema a medida..."
            style={inputStyle}
          />
        </FormRow>
      </div>

      {/* Group 2: goal */}
      <div style={groupStyle}>
        <FormRow label="Objetivo principal *">
          <textarea
            value={value.goal}
            onChange={(e) => onChange({ goal: e.target.value })}
            className={plusJakartaBody.className}
            placeholder="Contanos qué problema querés resolver..."
            rows={3}
            style={{ ...inputStyle, resize: "none" }}
          />
        </FormRow>
      </div>

      {/* Send method toggle */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <span
          className={plusJakartaBody.className}
          style={{
            fontSize: "11px",
            color: "rgba(0,0,0,0.4)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Enviar por
        </span>

        <div style={{ display: "flex", border: "1px solid rgba(0,0,0,0.12)", borderRadius: "8px", overflow: "hidden" }}>
          {(["whatsapp", "email"] as SendMethod[]).map((method, i) => (
            <button
              key={method}
              type="button"
              onClick={() => setSendMethod(method)}
              className={plusJakartaBody.className}
              style={{
                padding: "8px 20px",
                background: sendMethod === method ? "#0d0d0d" : "transparent",
                color: sendMethod === method ? "#fff" : "rgba(0,0,0,0.4)",
                border: "none",
                borderLeft: i === 1 ? "1px solid rgba(0,0,0,0.12)" : "none",
                cursor: "pointer",
                fontSize: "10px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                transition: "background 0.2s, color 0.2s",
              }}
            >
              {method === "whatsapp" ? "WhatsApp" : "Email"}
            </button>
          ))}
        </div>
      </div>

      {/* Primary CTA */}
      <button
        type="button"
        onClick={handleSend}
        disabled={!canSend}
        className={plusJakarta.className}
        style={{
          width: "100%",
          padding: "18px",
          background: canSend ? "#9EC7D4" : "rgba(0,0,0,0.08)",
          color: canSend ? "#000" : "rgba(0,0,0,0.25)",
          fontSize: "13px",
          letterSpacing: "0.1em",
          border: "none",
          borderRadius: "12px",
          cursor: canSend ? "pointer" : "not-allowed",
          textTransform: "uppercase",
          marginBottom: "10px",
          transition: "opacity 0.2s",
        }}
        onMouseEnter={(e) => canSend && (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        {sendMethod === "whatsapp" ? "Enviar por WhatsApp" : "Enviar por Email"}
      </button>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
        <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.07)" }} />
        <span className={plusJakartaBody.className} style={{ fontSize: "10px", color: "rgba(0,0,0,0.25)" }}>o</span>
        <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.07)" }} />
      </div>

      {/* Secondary: call */}
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
        className={plusJakartaBody.className}
        style={{
          width: "100%",
          padding: "16px",
          background: "rgba(0,0,0,0.06)",
          color: "rgba(0,0,0,0.5)",
          fontSize: "14px",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          marginBottom: "20px",
          transition: "background 0.2s, color 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(0,0,0,0.1)";
          e.currentTarget.style.color = "rgba(0,0,0,0.85)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(0,0,0,0.06)";
          e.currentTarget.style.color = "rgba(0,0,0,0.5)";
        }}
      >
        Agenda una llamada
      </button>

      {/* Legal */}
      <p
        className={plusJakartaBody.className}
        style={{
          fontSize: "10px",
          color: "rgba(0,0,0,0.3)",
          textAlign: "center",
        }}
      >
        Al enviar aceptás nuestros Términos y Política de Privacidad
      </p>

    </div>
  );
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: "12px 16px" }}>
      <label
        className={plusJakartaBody.className}
        style={{
          fontSize: "10px",
          color: "rgba(0,0,0,0.4)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          display: "block",
          marginBottom: "5px",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
