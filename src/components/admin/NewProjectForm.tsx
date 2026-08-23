"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "@/lib/admin/store";
import type { NewProjectInput } from "@/lib/admin/types";

const EMPTY: NewProjectInput = {
  clientName: "",
  clientCompany: "",
  clientEmail: "",
  clientPhone: "",
  title: "",
  summary: "",
  dueAt: "",
  budgetLabel: "",
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[color:rgba(250,252,252,0.5)]">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full border border-[color:rgba(250,252,252,0.25)] bg-transparent px-3 py-2.5 text-sm text-[color:var(--white)] focus:border-[color:var(--teal)] focus:outline-none";

export function NewProjectForm() {
  const router = useRouter();
  const [form, setForm] = useState<NewProjectInput>(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof NewProjectInput>(key: K, value: NewProjectInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.clientName.trim() || !form.title.trim()) return;
    setSubmitting(true);
    const project = createProject(form);
    router.push(`/admin/proyectos/${project.id}`);
  }

  return (
    <div className="mx-auto max-w-[640px]">
      <h1 className="font-title text-3xl uppercase tracking-[-0.02em]">Nuevo Proyecto</h1>
      <p className="mt-1 mb-8 font-mono text-[11px] uppercase tracking-wide text-[color:rgba(250,252,252,0.45)]">
        Se genera automáticamente un código de acceso para el portal del cliente
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Nombre del cliente *">
            <input
              required
              className={inputCls}
              value={form.clientName}
              onChange={(e) => update("clientName", e.target.value)}
            />
          </Field>
          <Field label="Empresa">
            <input
              className={inputCls}
              value={form.clientCompany}
              onChange={(e) => update("clientCompany", e.target.value)}
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              className={inputCls}
              value={form.clientEmail}
              onChange={(e) => update("clientEmail", e.target.value)}
            />
          </Field>
          <Field label="Teléfono / WhatsApp">
            <input
              className={inputCls}
              value={form.clientPhone}
              onChange={(e) => update("clientPhone", e.target.value)}
            />
          </Field>
        </div>

        <Field label="Título del proyecto *">
          <input required className={inputCls} value={form.title} onChange={(e) => update("title", e.target.value)} />
        </Field>

        <Field label="Resumen">
          <textarea
            rows={3}
            className={`${inputCls} resize-none`}
            value={form.summary}
            onChange={(e) => update("summary", e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Fecha de entrega estimada">
            <input
              type="date"
              className={inputCls}
              value={form.dueAt}
              onChange={(e) => update("dueAt", e.target.value)}
            />
          </Field>
          <Field label="Presupuesto">
            <input
              className={inputCls}
              placeholder="USD 1.500"
              value={form.budgetLabel}
              onChange={(e) => update("budgetLabel", e.target.value)}
            />
          </Field>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 border border-[color:var(--teal)] bg-[color:var(--teal)] py-3 font-mono text-[11px] uppercase tracking-[0.15em] text-[color:var(--dark)] disabled:opacity-50"
        >
          {submitting ? "Creando…" : "Crear proyecto"}
        </button>
      </form>
    </div>
  );
}
