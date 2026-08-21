import { getCurrentUser, isAdminUser } from "@/lib/auth/profile";
import { getProfileByUserId } from "@/lib/players";
import { getRiftscapePowerData } from "@/lib/server-status";
import { normalizeMcUuid } from "@/lib/auth/mc-verify";

/** Looks up a roster member's live power stats from the RIFTSCAPE Core API. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || !isAdminUser(user)) {
    return Response.json({ error: "Admin access required." }, { status: 403 });
  }

  const { id } = await params;
  const profile = await getProfileByUserId(id);
  if (!profile) {
    return Response.json({ error: "Member not found." }, { status: 404 });
  }

  const snapshot = await getRiftscapePowerData();
  if (!snapshot) {
    return Response.json(
      { error: "Power data is unavailable right now." },
      { status: 502 }
    );
  }

  const profileUuid = profile.mc_uuid ? normalizeMcUuid(profile.mc_uuid) : null;
  const match = snapshot.players.find(
    (p) =>
      (profileUuid && normalizeMcUuid(p.uuid) === profileUuid) ||
      p.name.toLowerCase() === profile.mc_user.toLowerCase()
  );

  if (!match) {
    return Response.json(
      { error: "No power data found for this member." },
      { status: 404 }
    );
  }

  return Response.json(
    { player: match, generatedAt: snapshot.generatedAt },
    { status: 200 }
  );
}
