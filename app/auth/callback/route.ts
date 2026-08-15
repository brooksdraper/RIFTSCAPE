import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

/**
 * Discord sends the survivor back here with a one-time `code`. Trading it for
 * a session is what actually writes the auth cookies.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // `//evil.com` also starts with "/" and would redirect off-site, so reject
  // protocol-relative paths alongside absolute ones.
  const requestedNext = searchParams.get("next") ?? "/";
  const next =
    requestedNext.startsWith("/") && !requestedNext.startsWith("//")
      ? requestedNext
      : "/";

  if (code) {
    const supabase = await getSupabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Behind Vercel's proxy `origin` is the internal host, so prefer the
      // forwarded host in production.
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocal = process.env.NODE_ENV === "development";
      const base =
        isLocal || !forwardedHost ? origin : `https://${forwardedHost}`;

      return NextResponse.redirect(`${base}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
