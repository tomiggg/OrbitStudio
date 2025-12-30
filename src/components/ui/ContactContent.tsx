"use client";

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
  canSend: boolean;
};

export function ContactContent({ value, onChange, onClose, onSend, canSend }: Props) {
  return (
    <div className="mx-auto w-full max-w-[520px]">
      {/* ✅ mantenemos el H3 grande, el TopBar ya no repite */}
      <h3 className="text-3xl font-extrabold tracking-[-0.04em] text-[#072b2a]">
        Contanos tu proyecto.
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-[#072b2a]/70">
        Te respondemos en el día con un plan claro y un presupuesto sin humo.
      </p>

      <div className="mt-7 grid gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nombre" required>
            <input
              value={value.name}
              onChange={(e) => onChange({ name: e.target.value })}
              className={inputBase}
              placeholder="Tu nombre"
            />
          </Field>

          <Field label="WhatsApp (opcional)">
            <input
              value={value.whatsApp}
              onChange={(e) => onChange({ whatsApp: e.target.value })}
              className={inputBase}
              placeholder="+54 9 ..."
            />
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Negocio (opcional)">
            <input
              value={value.business}
              onChange={(e) => onChange({ business: e.target.value })}
              className={inputBase}
              placeholder="Ej: Estudio, local, e-commerce..."
            />
          </Field>

          <Field label="Servicio">
            <SelectField>
              <select
                value={value.service}
                onChange={(e) => onChange({ service: e.target.value })}
                className={selectBase}
              >
                <option value="">No estoy seguro</option>
                <option value="Landing Page Profesional">Landing Page Profesional</option>
                <option value="Sitio Web Profesional">Sitio Web Profesional</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Web App / Sistema a medida">Web App / Sistema a medida</option>
              </select>
            </SelectField>
          </Field>
        </div>

        <Field label="Objetivo" required>
          <input
            value={value.goal}
            onChange={(e) => onChange({ goal: e.target.value })}
            className={inputBase}
            placeholder="Ej: conseguir consultas por WhatsApp, vender online…"
          />
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Plazo">
            <SelectField>
              <select
                value={value.timeline}
                onChange={(e) => onChange({ timeline: e.target.value as Timeline })}
                className={selectBase}
              >
                <option>Esta semana</option>
                <option>2–3 semanas</option>
                <option>1 mes</option>
                <option>Flexible</option>
              </select>
            </SelectField>
          </Field>

          <Field label="Presupuesto">
            <SelectField>
              <select
                value={value.budget}
                onChange={(e) => onChange({ budget: e.target.value as BudgetRange })}
                className={selectBase}
              >
                <option>No lo sé</option>
                <option>USD 150–350</option>
                <option>USD 350–800</option>
                <option>USD 800–1500</option>
                <option>USD 1500+</option>
              </select>
            </SelectField>
          </Field>
        </div>

        <Field label="Referencias (opcional)">
          <input
            value={value.refs}
            onChange={(e) => onChange({ refs: e.target.value })}
            className={inputBase}
            placeholder="Links de webs que te gustan (si tenés)"
          />
        </Field>

        <Field label="Detalles (opcional)">
          <textarea
            value={value.details}
            onChange={(e) => onChange({ details: e.target.value })}
            className={`${inputBase} min-h-[120px] resize-none`}
            placeholder="Qué ofrecés, qué problema querés resolver, secciones que necesitás, etc."
          />
        </Field>

        <p className="text-xs text-[#072b2a]/60">
          * Campos obligatorios. Respuesta en el día · Presupuesto claro · Sin compromiso
        </p>

        {/* Acciones */}
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="
              inline-flex items-center justify-center
              rounded-full
              border border-[#072b2a]/15
              bg-white/18 backdrop-blur
              px-6 py-3
              text-sm font-semibold text-[#072b2a]
              transition hover:bg-white/26
            "
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onSend}
            disabled={!canSend}
            className="
              inline-flex items-center justify-center
              rounded-full bg-[#072b2a]
              px-6 py-3
              text-sm font-semibold text-white
              shadow-[0_18px_45px_rgba(0,0,0,0.28)]
              transition hover:opacity-95
              disabled:cursor-not-allowed disabled:opacity-50
              active:scale-[0.99]
            "
          >
            Enviar por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-semibold text-[#072b2a]/85">
        {label} {required ? <span className="text-[#072b2a]/60">*</span> : null}
      </span>
      {children}
    </label>
  );
}

/** ✅ Wrapper para select con caret custom */
function SelectField({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      {/* caret */}
      <div
        aria-hidden
        className="
          pointer-events-none
          absolute right-4 top-1/2 -translate-y-1/2
          text-[#072b2a]/70
        "
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M7 10l5 5 5-5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

const inputBase =
  "w-full rounded-2xl border border-[#072b2a]/15 bg-white/18 backdrop-blur px-4 py-3 text-[#072b2a] placeholder:text-[#072b2a]/45 outline-none transition focus:border-[#072b2a]/25 focus:bg-white/22";

const selectBase =
  `${inputBase} pr-12 appearance-none cursor-pointer`;