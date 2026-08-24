import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Cliente Supabase server-only con la service role key (bypassa RLS).
// Usado tanto por el repositorio del panel admin (src/lib/admin/
// repository.supabase.ts) como por el endpoint de analytics
// (src/app/api/track/route.ts) — ninguno de los dos expone esta key al
// cliente ni hace chequeos de autorización acá: eso lo resuelve quien
// llama (route handlers / middleware).

let client: SupabaseClient | undefined;

export function getSupabaseAdminClient(): SupabaseClient {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Faltan SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY. Ver .env.example."
    );
  }
  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
