import "server-only";
import { createClient } from "@supabase/supabase-js";

let client;

// Service-role client -- bypasses RLS by design. Only ever imported from
// "use server" Server Action modules, never from client components.
export function getSupabaseServerClient() {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Copy .env.local.example to .env.local and fill them in."
    );
  }
  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}
