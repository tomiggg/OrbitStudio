import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";

// Agregación server-only sobre analytics_events para el dashboard de
// /admin/metricas. Con el volumen de tráfico esperado (agencia chica) es
// más simple traer las filas del rango y agregar en JS que mantener
// funciones/vistas SQL — MAX_ROWS es el techo de seguridad si el sitio
// alguna vez recibe un pico o tráfico de bots que se cuele.

const MAX_ROWS = 20000;

type EventRow = {
  session_id: string;
  event_type: string;
  path: string | null;
  referrer: string | null;
  utm_source: string | null;
  device_type: string | null;
  browser: string | null;
  country: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

export type Count = { label: string; count: number };

export type AnalyticsSummary = {
  rangeDays: number;
  totalPageviews: number;
  uniqueVisitors: number;
  contactOpens: number;
  contactSubmits: number;
  conversionRate: number; // contactSubmits / uniqueVisitors, 0-1
  dailySeries: { date: string; pageviews: number; visitors: number }[];
  topPaths: Count[];
  topReferrers: Count[];
  topUtmSources: Count[];
  deviceBreakdown: Count[];
  browserBreakdown: Count[];
  countryBreakdown: Count[];
  topServices: Count[];
  topProjects: Count[];
};

function topN(map: Map<string, number>, n: number): Count[] {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([label, count]) => ({ label, count }));
}

function increment(map: Map<string, number>, key: string | null | undefined) {
  const k = (key ?? "").trim();
  if (!k) return;
  map.set(k, (map.get(k) ?? 0) + 1);
}

function dayKey(iso: string): string {
  return iso.slice(0, 10); // YYYY-MM-DD, created_at siempre es ISO UTC
}

export async function getAnalyticsSummary(rangeDays: number): Promise<AnalyticsSummary> {
  const since = new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await getSupabaseAdminClient()
    .from("analytics_events")
    .select(
      "session_id, event_type, path, referrer, utm_source, device_type, browser, country, metadata, created_at"
    )
    .gte("created_at", since)
    .order("created_at", { ascending: true })
    .limit(MAX_ROWS);

  if (error) throw error;
  const rows = (data ?? []) as EventRow[];

  const pageviews = rows.filter((r) => r.event_type === "pageview");
  const uniqueSessions = new Set(rows.map((r) => r.session_id));
  const contactOpens = rows.filter((r) => r.event_type === "contact_open").length;
  const contactSubmits = rows.filter((r) => r.event_type === "contact_submit").length;

  const pathCounts = new Map<string, number>();
  const referrerSessions = new Map<string, Set<string>>();
  const utmSourceSessions = new Map<string, Set<string>>();
  const deviceCounts = new Map<string, number>();
  const browserCounts = new Map<string, number>();
  const countryCounts = new Map<string, number>();
  const serviceCounts = new Map<string, number>();
  const projectCounts = new Map<string, number>();

  const dailyPageviews = new Map<string, number>();
  const dailyVisitors = new Map<string, Set<string>>();

  for (const row of rows) {
    if (row.event_type === "pageview") {
      increment(pathCounts, row.path);
      increment(deviceCounts, row.device_type);
      increment(browserCounts, row.browser);
      increment(countryCounts, row.country);

      const day = dayKey(row.created_at);
      dailyPageviews.set(day, (dailyPageviews.get(day) ?? 0) + 1);
      if (!dailyVisitors.has(day)) dailyVisitors.set(day, new Set());
      dailyVisitors.get(day)!.add(row.session_id);

      const ref = (row.referrer ?? "").trim();
      if (ref) {
        let host = ref;
        try {
          host = new URL(ref).hostname.replace(/^www\./, "");
        } catch {
          // referrer no era una URL válida, se usa tal cual (truncado)
        }
        if (!referrerSessions.has(host)) referrerSessions.set(host, new Set());
        referrerSessions.get(host)!.add(row.session_id);
      }

      const utm = (row.utm_source ?? "").trim();
      if (utm) {
        if (!utmSourceSessions.has(utm)) utmSourceSessions.set(utm, new Set());
        utmSourceSessions.get(utm)!.add(row.session_id);
      }
    }

    if (row.event_type === "service_expand") {
      const service = row.metadata?.service;
      if (typeof service === "string") increment(serviceCounts, service);
    }

    if (row.event_type === "project_expand" || row.event_type === "project_link_click") {
      const project = row.metadata?.project;
      if (typeof project === "string") increment(projectCounts, project);
    }
  }

  const dailySeries: AnalyticsSummary["dailySeries"] = [];
  for (let i = rangeDays - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    dailySeries.push({
      date: key,
      pageviews: dailyPageviews.get(key) ?? 0,
      visitors: dailyVisitors.get(key)?.size ?? 0,
    });
  }

  const referrerCounts = new Map<string, number>(
    [...referrerSessions.entries()].map(([host, sessions]) => [host, sessions.size])
  );
  const utmCounts = new Map<string, number>(
    [...utmSourceSessions.entries()].map(([source, sessions]) => [source, sessions.size])
  );

  return {
    rangeDays,
    totalPageviews: pageviews.length,
    uniqueVisitors: uniqueSessions.size,
    contactOpens,
    contactSubmits,
    conversionRate: uniqueSessions.size > 0 ? contactSubmits / uniqueSessions.size : 0,
    dailySeries,
    topPaths: topN(pathCounts, 8),
    topReferrers: topN(referrerCounts, 8),
    topUtmSources: topN(utmCounts, 8),
    deviceBreakdown: topN(deviceCounts, 6),
    browserBreakdown: topN(browserCounts, 6),
    countryBreakdown: topN(countryCounts, 8),
    topServices: topN(serviceCounts, 8),
    topProjects: topN(projectCounts, 8),
  };
}
