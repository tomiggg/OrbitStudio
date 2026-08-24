import Link from "next/link";
import { getAnalyticsSummary } from "@/lib/analytics/queries";
import { formatCompact, formatPercent } from "@/lib/analytics/format";
import { jakarta } from "@/components/admin/fonts";
import { StatTile } from "@/components/admin/analytics/StatTile";
import { BarList } from "@/components/admin/analytics/BarList";
import { TrendChart } from "@/components/admin/analytics/TrendChart";

const RANGE_OPTIONS = [7, 30, 90] as const;

export const metadata = {
  title: "Métricas — Shift Studio Admin",
};

export default async function MetricsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const requested = Number(Array.isArray(params.dias) ? params.dias[0] : params.dias);
  const rangeDays = (RANGE_OPTIONS as readonly number[]).includes(requested) ? requested : 30;

  const summary = await getAnalyticsSummary(rangeDays);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1
            className={`${jakarta.className} text-3xl tracking-[-0.02em] text-white`}
            style={{ textTransform: "none" }}
          >
            Métricas
          </h1>
          <p className="text-sm text-white/60">
            Analítica propia del sitio — sin terceros, sin cookies de tracking. Últimos {rangeDays} días.
          </p>
        </div>
        <div className="flex gap-2">
          {RANGE_OPTIONS.map((d) => (
            <Link
              key={d}
              href={`/admin/metricas?dias=${d}`}
              className={`rounded-full border px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-widest transition no-underline ${
                d === rangeDays
                  ? "border-[var(--sky)] bg-[var(--sky)] text-[var(--ink)]"
                  : "border-[var(--sky)]/25 text-[var(--sky)] hover:bg-[var(--sky)]/10"
              }`}
            >
              {d}d
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Visitantes únicos" value={formatCompact(summary.uniqueVisitors)} />
        <StatTile label="Vistas de página" value={formatCompact(summary.totalPageviews)} />
        <StatTile
          label="Contactos iniciados"
          value={formatCompact(summary.contactOpens)}
          sublabel={`${summary.contactSubmits} enviados`}
        />
        <StatTile
          label="Conversión a contacto"
          value={formatPercent(summary.conversionRate)}
          sublabel="envíos / visitantes únicos"
        />
      </div>

      <TrendChart data={summary.dailySeries} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BarList title="Páginas más vistas" items={summary.topPaths} />
        <BarList title="De dónde vienen (referrer)" items={summary.topReferrers} emptyLabel="Todo el tráfico fue directo" />
        <BarList title="Campañas (UTM source)" items={summary.topUtmSources} emptyLabel="Sin tráfico de campañas todavía" />
        <BarList title="País" items={summary.countryBreakdown} />
        <BarList title="Dispositivo" items={summary.deviceBreakdown} />
        <BarList title="Navegador" items={summary.browserBreakdown} />
        <BarList title="Servicios más explorados" items={summary.topServices} emptyLabel="Nadie expandió un servicio todavía" />
        <BarList title="Proyectos más vistos" items={summary.topProjects} emptyLabel="Nadie exploró un proyecto todavía" />
      </div>
    </div>
  );
}
