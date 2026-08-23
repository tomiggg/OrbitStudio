"use client";

import { useState } from "react";
import { verifyAccessCode } from "@/lib/admin/store";
import { unlockPortal } from "@/lib/admin/portal-session";

export function AccessGate({
  projectId,
  clientLabel,
  onUnlock,
}: {
  projectId: string;
  clientLabel: string;
  onUnlock: () => void;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (verifyAccessCode(projectId, code)) {
      unlockPortal(projectId);
      onUnlock();
    } else {
      setError(true);
    }
  }

  return (
    <div className="mx-auto max-w-[380px] py-16 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--teal)]">{clientLabel}</p>
      <h1 className="mt-2 font-title text-2xl uppercase tracking-[-0.02em]">Acceso al proyecto</h1>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-wide text-[color:rgba(250,252,252,0.45)]">
        Ingresá el código que te compartimos por WhatsApp o email
      </p>
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3">
        <input
          autoFocus
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(false);
          }}
          placeholder="CÓDIGO DE ACCESO"
          className="w-full border border-[color:rgba(250,252,252,0.25)] bg-transparent px-3 py-3 text-center font-mono text-sm uppercase tracking-[0.2em] text-[color:var(--white)] placeholder:text-[color:rgba(250,252,252,0.3)] focus:border-[color:var(--teal)] focus:outline-none"
        />
        {error ? (
          <p className="font-mono text-[10px] uppercase tracking-wide text-red-400">Código incorrecto.</p>
        ) : null}
        <button
          type="submit"
          className="border border-[color:var(--teal)] bg-[color:var(--teal)] py-3 font-mono text-[11px] uppercase tracking-[0.15em] text-[color:var(--dark)]"
        >
          Ver estado del proyecto
        </button>
      </form>
    </div>
  );
}
