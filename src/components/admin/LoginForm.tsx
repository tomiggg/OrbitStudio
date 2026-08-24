"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AdminButton, AdminCard, AdminInput } from "@/components/admin/ui/AdminPrimitives";
import { jakarta } from "@/components/admin/fonts";

export function LoginForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "No se pudo iniciar sesión.");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Error de conexión. Probá de nuevo.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-1">
      <AdminCard className="flex flex-col gap-5 p-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--sky)]">
            Shift Studio / admin
          </p>
          <h1 className={`mt-1 ${jakarta.className} text-2xl tracking-tight text-white`}>
            Iniciar sesión
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            />
          </div>
          {error && <p className="font-mono text-[10px] text-[#c2453a]">{error}</p>}
          <AdminButton type="submit" disabled={loading || !name.trim() || !password}>
            {loading ? "Entrando..." : "Entrar"}
          </AdminButton>
        </form>
      </AdminCard>
    </div>
  );
}
