"use client";

// Analytics propio del sitio de marketing: sin terceros, sin cookies de
// tracking, sin IP guardada. session_id es un uuid anónimo en
// localStorage solo para agrupar eventos de una misma visita — no es PII
// ni se cruza con nada. Respeta Do Not Track.

const STORAGE_KEY = "ss_sid";
const ENDPOINT = "/api/track";

export const ANALYTICS_EVENTS = {
  pageview: "pageview",
  contactOpen: "contact_open",
  contactSubmit: "contact_submit",
  serviceExpand: "service_expand",
  projectExpand: "project_expand",
  projectLinkClick: "project_link_click",
} as const;

export type AnalyticsEventType = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

function getSessionId(): string {
  try {
    let id = window.localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = crypto.randomUUID();
      window.localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    // localStorage bloqueado (modo privado estricto, etc.) — se manda un
    // id efímero, ese evento simplemente no se puede agrupar con otros.
    return `ephemeral-${Math.random().toString(36).slice(2)}`;
  }
}

function isTrackingDisabled(): boolean {
  const dnt =
    navigator.doNotTrack ??
    (window as unknown as { doNotTrack?: string }).doNotTrack;
  return dnt === "1" || dnt === "yes";
}

export function track(eventType: AnalyticsEventType, metadata?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (isTrackingDisabled()) return;

  const params = new URLSearchParams(window.location.search);
  const payload = {
    sessionId: getSessionId(),
    eventType,
    path: window.location.pathname,
    locale: document.documentElement.lang || undefined,
    referrer: document.referrer || undefined,
    utmSource: params.get("utm_source") || undefined,
    utmMedium: params.get("utm_medium") || undefined,
    utmCampaign: params.get("utm_campaign") || undefined,
    utmTerm: params.get("utm_term") || undefined,
    utmContent: params.get("utm_content") || undefined,
    metadata: metadata ?? {},
  };

  const body = JSON.stringify(payload);

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      const sent = navigator.sendBeacon(ENDPOINT, blob);
      if (sent) return;
    }
  } catch {
    // sigue al fetch de abajo
  }

  fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // el tracking nunca debe romper la experiencia del visitante
  });
}
