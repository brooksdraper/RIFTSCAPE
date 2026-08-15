import { getSupabaseServer } from "@/lib/supabase/server";
import { getProfileByUserId } from "@/lib/players";

/**
 * Whitelisting is Discord-gated the same way enrollment is, and additionally
 * requires an enrolled profile — the Minecraft username it sends to the
 * RIFTSCAPE server comes from that verified record, never from the request.
 */
export async function POST(request: Request) {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json(
      { error: "Sign in before submitting the agreement." },
      { status: 401 },
    );
  }

  const profile = await getProfileByUserId(user.id);
  if (!profile) {
    return Response.json(
      { error: "Enroll with a Minecraft username before whitelisting." },
      { status: 400 },
    );
  }

  const body = await request.json().catch(() => null);
  const agreed =
    body?.age18 === true && body?.rules === true && body?.terms === true;

  if (!agreed) {
    return Response.json(
      { error: "All three agreements must be accepted." },
      { status: 400 },
    );
  }

  // ========== WHITELIST LOCK CHECK ==========

  const whitelistUnlocked = ["1", "true", "yes", "on"].includes(
    String(process.env.WHITELIST_UNLOCKED ?? "").toLowerCase(),
  );

  if (!whitelistUnlocked) {
    return Response.json(
      {
        error:
          "Whitelist access is currently locked. It will open once administration opens it.",
      },
      { status: 403 },
    );
  }

  const rawIp = process.env.RIFTSCAPE_RAW_IP;
  const port = process.env.RIFTSCAPE_API_PORT;
  const token = process.env.RIFTSCAPE_API_TOKEN;

  if (!rawIp || !port || !token) {
    console.error("Whitelist request failed: RIFTSCAPE API is not configured.");
    return Response.json(
      { error: "Whitelisting is not available right now. Try again later." },
      { status: 502 },
    );
  }

  try {
    const res = await fetch(`${rawIp}:${port}/whitelist`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ player: profile.mc_user }),
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: undefined }));
      console.error(
        "Whitelist request rejected by RIFTSCAPE API:",
        res.status,
        error,
      );
      return Response.json(
        {
          error:
            error ?? "The server rejected the whitelist request. Try again.",
        },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("Failed to reach RIFTSCAPE API for whitelisting:", err);
    return Response.json(
      { error: "Could not reach the RIFTSCAPE server. Try again." },
      { status: 502 },
    );
  }

  return Response.json({ success: true }, { status: 200 });
}
