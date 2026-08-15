"use client";

import { getSupabaseBrowser } from "@/lib/supabase/browser";

/**
 * Kicks off the Discord OAuth handshake. Supabase redirects the whole page to
 * Discord, so nothing after a successful call runs.
 *
 * @param next Path to land on after `/auth/callback` finishes. Defaults to
 *   wherever the survivor already is, so signing in never loses their place.
 */
export async function signInWithDiscord(next?: string) {
  const supabase = getSupabaseBrowser();

  const target =
    next ??
    `${window.location.pathname}${window.location.search}${window.location.hash}`;

  return supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(target)}`,
      scopes: "identify email",
    },
  });
}
