"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { AdminButton, AdminCard, AdminLabel } from "@/components/admin/ui/AdminPrimitives";

export function PortalLinkCard({ token }: { token: string }) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Render inicial en "" a propósito para que coincida con el server; se
    // completa recién tras el mount para evitar mismatch de hidratación.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrigin(window.location.origin);
  }, []);

  const url = `${origin}/portal/${token}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard no disponible, el link sigue visible para copiar a mano
    }
  }

  return (
    <AdminCard className="flex flex-col items-start gap-4 p-5">
      <AdminLabel>Acceso del cliente</AdminLabel>
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="border border-white bg-white p-2">
          {origin && <QRCodeSVG value={url} size={128} />}
        </div>
        <div className="flex flex-col gap-2">
          <p className="max-w-xs break-all font-mono text-xs text-white/70">
            {origin ? url : "cargando..."}
          </p>
          <AdminButton variant="ghost" onClick={handleCopy} disabled={!origin}>
            {copied ? "Copiado" : "Copiar link"}
          </AdminButton>
        </div>
      </div>
    </AdminCard>
  );
}
