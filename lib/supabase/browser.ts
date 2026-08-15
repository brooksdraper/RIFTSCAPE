import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client for Client Components. Reads and writes the auth cookies
 * that `lib/supabase/server.ts` and `proxy.ts` see, so a Discord sign-in in
 * the browser is visible to the next server render.
 *
 * `createBrowserClient` is a singleton, so repeated calls reuse one client.
 */
export function getSupabaseBrowser(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
