"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { useMounted } from "@/hooks/useMounted";

export function QRPanel({ projectId, accessCode }: { projectId: string; accessCode: string }) {
  const mounted = useMounted();
  const portalUrl = mounted ? `${window.location.origin}/portal/${projectId}` : "";
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!portalUrl) return;
    let cancelled = false;
    QRCode.toDataURL(portalUrl, {
      margin: 1,
      width: 220,
      color: { dark: "#072B2A", light: "#FAFCFC" },
    })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [portalUrl]);

  function copyLink() {
    navigator.clipboard.writeText(portalUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div className="border border-[color:rgba(250,252,252,0.15)] p-5">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.15em] text-[color:rgba(250,252,252,0.5)]">
        Acceso del cliente
      </p>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="flex h-[144px] w-[144px] shrink-0 items-center justify-center bg-[color:var(--bg-light)]">
          {qrDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrDataUrl} alt={`QR del portal para ${projectId}`} className="h-full w-full object-contain" />
          ) : (
            <span className="font-mono text-[9px] uppercase text-[color:var(--dark)]">Generando…</span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wide text-[color:rgba(250,252,252,0.4)]">Link</p>
            <p className="truncate font-mono text-xs text-[color:var(--white)]">{portalUrl || "…"}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wide text-[color:rgba(250,252,252,0.4)]">
              Código de acceso
            </p>
            <p className="font-mono text-lg tracking-[0.2em] text-[color:var(--teal)]">{accessCode}</p>
          </div>
          <button
            type="button"
            onClick={copyLink}
            className="self-start border border-[color:rgba(250,252,252,0.25)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-[color:rgba(250,252,252,0.7)] hover:border-[color:var(--teal)] hover:text-[color:var(--teal)]"
          >
            {copied ? "Copiado" : "Copiar link"}
          </button>
        </div>
      </div>
    </div>
  );
}
