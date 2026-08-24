import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "./session";

export async function getCurrentAdminName(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);
  return session?.name ?? null;
}
