"use client";

import { useState, type ReactNode } from "react";
import { loginAdmin, logoutAdmin, useAdminSession } from "@/lib/admin/auth";
import { AdminButton, AdminCard, AdminInput, AdminLabel } from "@/components/admin/ui/AdminPrimitives";

export function AdminAuthGate({ children }: { children: ReactNode }) {
  const session = useAdminSession();

  if (!session) {
    return <AdminLoginForm />;
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <AdminLabel>Sesión: {session.name}</AdminLabel>
        <button
          type="button"
          onClick={logoutAdmin}
          className="font-mono text-[10px] uppercase tracking-widest text-white/40 hover:text-[var(--teal)]"
        >
          Cerrar sesión
        </button>
      </div>
      <div className="mt-6">{children}</div>
    </>
  );
}

function AdminLoginForm() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit() {
    const ok = loginAdmin(name, password);
    if (!ok) {
      setError(true);
      return;
    }
    setError(false);
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col items-stretch gap-4 py-16">
      <AdminCard className="flex flex-col gap-4 p-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--teal)]">
            Acceso restringido
          </p>
          <h1 className="font-[family-name:var(--font-title)] text-2xl uppercase tracking-tight text-white">
            Admin
          </h1>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[10px] uppercase tracking-widest text-white/50">
            Nombre
          </label>
          <AdminInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            autoFocus
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[10px] uppercase tracking-widest text-white/50">
            Contraseña
          </label>
          <AdminInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
          />
        </div>
        {error && (
          <p className="font-mono text-[10px] uppercase tracking-widest text-red-400">
            Contraseña incorrecta.
          </p>
        )}
        <AdminButton onClick={handleSubmit} disabled={!password}>
          Entrar
        </AdminButton>
      </AdminCard>
    </div>
  );
}
