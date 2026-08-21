import { getSupabaseServer } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getProfileByUserId } from "@/lib/players";
import { getFactionByMemberId, FACTION_FIELDS } from "@/lib/factions";
import { isFactionBaseColor } from "@/lib/factions/colors";
import { FACTION_NAME_PATTERN } from "@/lib/validation";
import { getActiveSeason } from "@/lib/seasons";

/**
 * Faction registration is gated the same way enrollment is: the survivor
 * proves who they are through the Discord session, and the Minecraft
 * identity attached to the faction comes from their already-verified
 * profile, never from the request body.
 */
export async function POST(request: Request) {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json(
      { error: "Sign in with Discord before registering a faction." },
      { status: 401 }
    );
  }

  const profile = await getProfileByUserId(user.id);
  if (!profile) {
    return Response.json(
      { error: "Enroll as a survivor before registering a faction." },
      { status: 400 }
    );
  }

  const activeSeason = await getActiveSeason();
  if (!activeSeason) {
    return Response.json(
      { error: "Faction registration isn't open right now." },
      { status: 503 }
    );
  }

  const joined = await getFactionByMemberId(profile.id);
  if (joined) {
    return Response.json(
      { error: "You are already a member of a faction." },
      { status: 409 }
    );
  }

  const body = await request.json();
  const name = String(body?.name ?? "").trim();
  const baseColor = String(body?.baseColor ?? "");

  if (!FACTION_NAME_PATTERN.test(name)) {
    return Response.json(
      {
        error:
          "Faction name must be 3-24 characters (letters, numbers, spaces, - and _).",
      },
      { status: 400 }
    );
  }

  if (!isFactionBaseColor(baseColor)) {
    return Response.json(
      { error: "Choose a valid base color." },
      { status: 400 }
    );
  }

  // Service role, so RLS can stay read-only for everyone: members starts
  // empty and is never accepted from the request body.
  const { data, error } = await getSupabaseAdmin()
    .from("factions")
    .insert({
      name,
      base_color: baseColor,
      owner_id: profile.id,
      owner_mc_user: profile.mc_user,
      owner_mc_uuid: profile.mc_uuid,
      season_id: activeSeason.id,
    })
    .select(FACTION_FIELDS)
    .single();

  if (error) {
    // 23505 covers two possible collisions; the message names the one hit.
    if (error.code === "23505") {
      const alreadyOwnsFaction = error.message.includes("owner_id");

      return Response.json(
        {
          error: alreadyOwnsFaction
            ? "You have already registered a faction."
            : "That faction name is already taken.",
        },
        { status: 409 }
      );
    }

    console.error("Failed to register faction:", error.message);
    return Response.json(
      { error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }

  return Response.json({ faction: data }, { status: 201 });
}
