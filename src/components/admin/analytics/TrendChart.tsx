"use client";

import { useMemo, useState } from "react";
import { AdminCard, AdminLabel } from "@/components/admin/ui/AdminPrimitives";

type Point = { date: string; pageviews: number; visitors: number };

const WIDTH = 720;
const HEIGHT = 200;
const PAD = { top: 12, right: 12, bottom: 24, left: 30 };
const ACCENT = "#9EC7D4"; // --sky — serie principal (vistas)
const MUTED = "#5c6b70"; // gris de-emphasis — serie secundaria (visitantes)

function formatDayLabel(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", timeZone: "UTC" });
}

// Serie temporal "emphasis": un hue de acento (vistas) + gris neutro
// (visitantes únicos) sobre un solo eje — no necesita paleta categórica
// validada (el gris no tiene hue que confundir bajo CVD). Crosshair +
// tooltip por posición de puntero, como pide la skill de dataviz para
// cualquier line/area chart.
export function TrendChart({ data }: { data: Point[] }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const plotW = WIDTH - PAD.left - PAD.right;
  const plotH = HEIGHT - PAD.top - PAD.bottom;

  const maxValue = useMemo(
    () => Math.max(1, ...data.map((d) => Math.max(d.pageviews, d.visitors))),
    [data]
  );

  const x = (i: number) => PAD.left + (data.length <= 1 ? 0 : (i / (data.length - 1)) * plotW);
  const y = (v: number) => PAD.top + plotH - (v / maxValue) * plotH;

  const pageviewsPath = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(d.pageviews)}`).join(" ");
  const visitorsPath = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(d.visitors)}`).join(" ");

  const yTicks = [0, Math.round(maxValue / 2), maxValue];
  const active = hoverIndex !== null ? data[hoverIndex] : null;

  function handlePointerMove(e: React.PointerEvent<SVGRectElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const ratio = Math.min(1, Math.max(0, relX / rect.width));
    const idx = Math.round(ratio * (data.length - 1));
    setHoverIndex(idx);
  }

  return (
    <AdminCard className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <AdminLabel>Vistas y visitantes por día</AdminLabel>
        <div className="flex items-center gap-4 font-mono text-[9px] uppercase tracking-widest text-white/50">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-[2px] w-3" style={{ background: ACCENT }} />
            Vistas
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-[2px] w-3" style={{ background: MUTED }} />
            Visitantes
          </span>
        </div>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label="Vistas y visitantes únicos por día">
          {yTicks.map((t) => (
            <g key={t}>
              <line
                x1={PAD.left}
                x2={WIDTH - PAD.right}
                y1={y(t)}
                y2={y(t)}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={1}
              />
              <text x={PAD.left - 6} y={y(t) + 3} textAnchor="end" fontSize={9} fill="rgba(255,255,255,0.35)">
                {t}
              </text>
            </g>
          ))}

          <path d={visitorsPath} fill="none" stroke={MUTED} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          <path d={pageviewsPath} fill="none" stroke={ACCENT} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

          {data.length > 0 && (
            <>
              <circle cx={x(data.length - 1)} cy={y(data[data.length - 1].pageviews)} r={4} fill={ACCENT} stroke="var(--ink-2)" strokeWidth={2} />
              <circle cx={x(data.length - 1)} cy={y(data[data.length - 1].visitors)} r={4} fill={MUTED} stroke="var(--ink-2)" strokeWidth={2} />
            </>
          )}

          {[0, Math.floor(data.length / 2), data.length - 1].map((i) =>
            data[i] ? (
              <text key={i} x={x(i)} y={HEIGHT - 6} textAnchor="middle" fontSize={9} fill="rgba(255,255,255,0.35)">
                {formatDayLabel(data[i].date)}
              </text>
            ) : null
          )}

          {active && (
            <line
              x1={x(hoverIndex!)}
              x2={x(hoverIndex!)}
              y1={PAD.top}
              y2={PAD.top + plotH}
              stroke="rgba(255,255,255,0.25)"
              strokeWidth={1}
            />
          )}

          <rect
            x={PAD.left}
            y={PAD.top}
            width={plotW}
            height={plotH}
            fill="transparent"
            onPointerMove={handlePointerMove}
            onPointerLeave={() => setHoverIndex(null)}
          />
        </svg>

        {active && (
          <div
            className="pointer-events-none absolute top-0 rounded-lg border border-[var(--sky)]/20 bg-[var(--ink)] px-3 py-2 text-xs shadow-lg"
            style={{
              left: `${Math.min(Math.max((x(hoverIndex!) / WIDTH) * 100, 12), 88)}%`,
              transform: "translateX(-50%)",
            }}
          >
            <p className="mb-1 font-mono text-[9px] uppercase tracking-widest text-white/40">
              {formatDayLabel(active.date)}
            </p>
            <p className="flex items-center gap-2 text-white">
              <span className="inline-block h-[2px] w-3" style={{ background: ACCENT }} />
              <strong className="font-mono">{active.pageviews}</strong> vistas
            </p>
            <p className="flex items-center gap-2 text-white/70">
              <span className="inline-block h-[2px] w-3" style={{ background: MUTED }} />
              <strong className="font-mono">{active.visitors}</strong> visitantes
            </p>
          </div>
        )}
      </div>
    </AdminCard>
  );
}
