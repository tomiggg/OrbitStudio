"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/admin/auth";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (login(password)) {
      router.replace("/admin");
    } else {
      setError(true);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[color:var(--dark)] px-6">
      <div className="w-full max-w-[380px]">
        <div className="mb-8 text-center">
          <p className="font-title text-2xl uppercase tracking-[-0.02em] text-[color:var(--white)]">Shift Studio</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--teal)]">
            Panel administrativo
          </p>
        </div>
        <form onSubmit={handleSubmit} className="border border-[color:rgba(250,252,252,0.15)] p-6">
          <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.15em] text-[color:rgba(250,252,252,0.5)]">
            Contraseña
          </label>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            className="w-full border border-[color:rgba(250,252,252,0.25)] bg-transparent px-3 py-2.5 text-sm text-[color:var(--white)] focus:border-[color:var(--teal)] focus:outline-none"
          />
          {error ? (
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wide text-red-400">
              Contraseña incorrecta.
            </p>
          ) : null}
          <button
            type="submit"
            className="mt-5 w-full border border-[color:var(--teal)] bg-[color:var(--teal)] py-2.5 font-mono text-[11px] uppercase tracking-[0.15em] text-[color:var(--dark)]"
          >
            Ingresar
          </button>
        </form>
        <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-wide text-[color:rgba(250,252,252,0.3)]">
          Acceso interno — Shift Studio
        </p>
      </div>
    </div>
  );
}
