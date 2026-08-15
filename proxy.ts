import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Refreshes the Supabase auth token on every request and writes the rotated
 * cookies back onto the response.
 *
 * Server Components can read cookies but not set them, so without this the
 * access token would expire and every survivor would get silently logged out.
 * (Next.js 16 renamed Middleware to Proxy; same mechanism.)
 */
export async function proxy(request: NextRequest) {
  /**
   * Server Components can read headers but not the request URL, and the root
   * layout needs the path to decide whether to render site chrome (the in-game
   * screen renders bare). Rebuilt from `request` on every call rather than
   * cloned once, so the cookie writes below aren't dropped on the way through.
   */
  const withPathname = () => {
    const headers = new Headers(request.headers);
    headers.set("x-pathname", request.nextUrl.pathname);
    return NextResponse.next({ request: { headers } });
  };

  let response = withPathname();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Without Supabase configured there is no session to refresh — pass through
  // rather than 500 every route in the app.
  if (!supabaseUrl || !supabaseAnonKey) return response;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }

        response = withPathname();

        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }

        // Supabase hands back the no-store headers that keep a CDN from
        // caching a response carrying someone's Set-Cookie session.
        for (const [key, value] of Object.entries(headers)) {
          response.headers.set(key, value);
        }
      },
    },
  });

  // Triggers the refresh; the rotated tokens land via setAll above.
  await supabase.auth.getClaims();

  return response;
}

export const config = {
  matcher: [
    /*
     * Everything except static assets — those never carry a session and
     * refreshing on each one would burn requests against Supabase.
     */
    "/((?!_next/static|_next/image|favicon.ico|font/|img/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
