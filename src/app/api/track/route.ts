import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { isBotUserAgent, parseUserAgent } from "@/lib/analytics/parseUserAgent";

// Runtime Node (no Edge): getSupabaseAdminClient usa el SDK de
// supabase-js tal como lo usa el resto del panel admin.
export const runtime = "nodejs";

const ALLOWED_EVENT_TYPES = new Set([
  "pageview",
  "contact_open",
  "contact_submit",
  "service_expand",
  "project_expand",
  "project_link_click",
]);

const MAX_METADATA_JSON_LENGTH = 2000;

function truncate(value: unknown, max: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, max);
}

// Nunca debe romper la experiencia del visitante ni filtrar por qué se
// descartó un evento — cualquier entrada inválida o sospechosa devuelve
// 204 igual que un evento aceptado.
const NO_CONTENT = new NextResponse(null, { status: 204 });

export async function POST(request: Request) {
  try {
    const ua = request.headers.get("user-agent");
    if (isBotUserAgent(ua)) return NO_CONTENT;

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return NO_CONTENT;

    const eventType = truncate((body as Record<string, unknown>).eventType, 40);
    if (!eventType || !ALLOWED_EVENT_TYPES.has(eventType)) return NO_CONTENT;

    const sessionId = truncate((body as Record<string, unknown>).sessionId, 120);
    if (!sessionId) return NO_CONTENT;

    let metadata: Record<string, unknown> = {};
    const rawMetadata = (body as Record<string, unknown>).metadata;
    if (rawMetadata && typeof rawMetadata === "object") {
      const serialized = JSON.stringify(rawMetadata);
      if (serialized.length <= MAX_METADATA_JSON_LENGTH) {
        metadata = rawMetadata as Record<string, unknown>;
      }
    }

    const { deviceType, browser, os } = parseUserAgent(ua);
    const country = request.headers.get("x-vercel-ip-country") || undefined;
    const rawCity = request.headers.get("x-vercel-ip-city");
    const city = rawCity ? decodeURIComponent(rawCity) : undefined;

    const record = body as Record<string, unknown>;
    const supabase = getSupabaseAdminClient();
    await supabase.from("analytics_events").insert({
      session_id: sessionId,
      event_type: eventType,
      path: truncate(record.path, 300),
      locale: truncate(record.locale, 10),
      referrer: truncate(record.referrer, 500),
      utm_source: truncate(record.utmSource, 150),
      utm_medium: truncate(record.utmMedium, 150),
      utm_campaign: truncate(record.utmCampaign, 150),
      utm_term: truncate(record.utmTerm, 150),
      utm_content: truncate(record.utmContent, 150),
      country,
      city,
      device_type: deviceType,
      browser,
      os,
      metadata,
    });

    return NO_CONTENT;
  } catch {
    return NO_CONTENT;
  }
}
