// Sesión admin: cookie httpOnly firmada con HMAC (Web Crypto), sin estado en
// el servidor. Usa solo APIs disponibles tanto en el runtime Edge del
// middleware como en el runtime Node de los route handlers.

export const ADMIN_SESSION_COOKIE = "shift_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 días

export const ADMIN_PASSWORD_DEFAULT = "shiftstudio2026";

function sessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || "dev-insecure-secret-change-me";
}

function utf8ToBase64Url(input: string): string {
  const b64 = btoa(unescape(encodeURIComponent(input)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToUtf8(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  return decodeURIComponent(escape(atob(padded + pad)));
}

function bytesToHex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(sessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

async function sign(payload: string): Promise<string> {
  const key = await hmacKey();
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return bytesToHex(sig);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export type AdminSession = { name: string };

export async function createSessionToken(name: string): Promise<string> {
  const payload = JSON.stringify({ name, exp: Date.now() + SESSION_TTL_MS });
  const encoded = utf8ToBase64Url(payload);
  const sig = await sign(encoded);
  return `${encoded}.${sig}`;
}

export async function verifySessionToken(
  token: string | undefined | null
): Promise<AdminSession | null> {
  if (!token) return null;
  const [encoded, sig] = token.split(".");
  if (!encoded || !sig) return null;
  const expectedSig = await sign(encoded);
  if (!timingSafeEqual(sig, expectedSig)) return null;
  try {
    const payload = JSON.parse(base64UrlToUtf8(encoded)) as { name?: unknown; exp?: unknown };
    if (typeof payload.exp !== "number" || Date.now() > payload.exp) return null;
    if (typeof payload.name !== "string" || !payload.name) return null;
    return { name: payload.name };
  } catch {
    return null;
  }
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || ADMIN_PASSWORD_DEFAULT;
  return password === expected;
}
