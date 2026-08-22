import { cookies } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/**
 * Marketing campaigns link to /discord?d=<source_id>; DiscordRedirectPlate
 * calls this once on mount to log the click before bouncing to Discord.
 *
 * Server Components can't set cookies (only Route Handlers and Server
 * Functions can), which is why this lives here instead of in app/discord's
 * page render — the session cookie is what caps attribution at one row per
 * browser session, so a refresh, back-button, or repeat campaign click
 * within the same session doesn't insert a duplicate row.
 */
const SESSION_COOKIE = "discord_click_logged";

export async function POST(request: Request) {
  const cookieStore = await cookies();

  if (cookieStore.get(SESSION_COOKIE)) {
    return Response.json({ logged: false });
  }

  const body = await request.json().catch(() => ({}));
  const sourceId = typeof body?.sourceId === "string" ? body.sourceId : "";

  if (!sourceId) {
    return Response.json({ logged: false });
  }

  try {
    await getSupabaseAdmin()
      .from("discord_redirect_clicks")
      .insert({ source_id: sourceId });
  } catch (err) {
    console.error("Failed to log discord redirect click:", err);
    return Response.json({ logged: false });
  }

  // No maxAge: a session cookie that clears when the browser closes, so a
  // new session can be attributed again rather than being suppressed forever.
  cookieStore.set(SESSION_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return Response.json({ logged: true });
}
