import { getSupabaseServer } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getProfileByUserId } from "@/lib/players";
import { getFactionByOwnerId, getFactionByMemberId, FACTION_FIELDS } from "@/lib/factions";
import { getActiveSeason } from "@/lib/seasons";

/**
 * A survivor can belong to exactly one faction, whether as the owner or a
 * member — so joining is refused if either lookup already resolves.
 */
export async function POST(request: Request) {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json(
      { error: "Sign in with Discord before joining a faction." },
      { status: 401 }
    );
  }

  const profile = await getProfileByUserId(user.id);
  if (!profile) {
    return Response.json(
      { error: "Enroll as a survivor before joining a faction." },
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

  const body = await request.json();
  const factionId = String(body?.factionId ?? "");
  if (!factionId) {
    return Response.json({ error: "Missing faction." }, { status: 400 });
  }

  const [owned, joined] = await Promise.all([
    getFactionByOwnerId(profile.id),
    getFactionByMemberId(profile.id),
  ]);

  if (owned || joined) {
    return Response.json(
      { error: "You are already in a faction." },
      { status: 409 }
    );
  }

  const admin = getSupabaseAdmin();

  const { data: faction, error: fetchError } = await admin
    .from("factions")
    .select("id, owner_id, members")
    .eq("id", factionId)
    .eq("season_id", activeSeason.id)
    .maybeSingle();

  if (fetchError) {
    console.error("Failed to fetch faction to join:", fetchError.message);
    return Response.json(
      { error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }

  if (!faction) {
    return Response.json({ error: "Faction not found." }, { status: 404 });
  }

  if (faction.owner_id === profile.id) {
    return Response.json(
      { error: "You already lead this faction." },
      { status: 409 }
    );
  }

  const { data, error } = await admin
    .from("factions")
    .update({ members: [...faction.members, profile.id] })
    .eq("id", factionId)
    .select(FACTION_FIELDS)
    .single();

  if (error) {
    console.error("Failed to join faction:", error.message);
    return Response.json(
      { error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }

  return Response.json({ faction: data }, { status: 200 });
}
