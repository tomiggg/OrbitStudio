// Parser de User-Agent liviano y aproximado a propósito — para analítica
// agregada (dispositivo/navegador/SO) no hace falta la precisión de una
// librería como ua-parser-js, y evita sumar una dependencia nueva solo
// para esto.

export type ParsedUserAgent = {
  deviceType: "mobile" | "tablet" | "desktop";
  browser: string;
  os: string;
};

export function parseUserAgent(ua: string | null): ParsedUserAgent {
  const s = ua ?? "";

  let deviceType: ParsedUserAgent["deviceType"] = "desktop";
  if (/ipad|tablet(?!.*mobile)/i.test(s)) deviceType = "tablet";
  else if (/mobi|iphone|ipod|android/i.test(s)) deviceType = "mobile";

  let os = "Otro";
  if (/windows/i.test(s)) os = "Windows";
  else if (/mac os x|macintosh/i.test(s)) os = "macOS";
  else if (/android/i.test(s)) os = "Android";
  else if (/iphone|ipad|ipod/i.test(s)) os = "iOS";
  else if (/linux/i.test(s)) os = "Linux";

  let browser = "Otro";
  if (/edg\//i.test(s)) browser = "Edge";
  else if (/opr\/|opera/i.test(s)) browser = "Opera";
  else if (/crios\//i.test(s)) browser = "Chrome";
  else if (/fxios\/|firefox\//i.test(s)) browser = "Firefox";
  else if (/chrome\//i.test(s)) browser = "Chrome";
  else if (/safari\//i.test(s)) browser = "Safari";

  return { deviceType, browser, os };
}

const BOT_UA_PATTERN =
  /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegrambot|preview|headless|lighthouse|pingdom|uptime|monitor|curl|wget|python-requests/i;

export function isBotUserAgent(ua: string | null): boolean {
  if (!ua) return true;
  return BOT_UA_PATTERN.test(ua);
}
