import { getCurrentUser, isAdminUser } from "@/lib/auth/profile";
import {
  TIER_RANK,
  updatePlayerAdmin,
  removePlayerAdmin,
  getProfilesByIdsAdmin,
  type EnrolledPlayer,
} from "@/lib/players";
import { unwhitelistPlayer } from "@/lib/server-status";

const VALID_TIERS = Object.keys(TIER_RANK) as EnrolledPlayer["tier"][];

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || !isAdminUser(user)) {
    return null;
  }
  return user;
}

/** Edits a roster member's tier, life number, or verification from the admin panel. */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return Response.json({ error: "Admin access required." }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);

  const updates: {
    tier?: EnrolledPlayer["tier"];
    life_number?: number;
    verified?: boolean;
    red_strikes?: number;
    points?: number;
  } = {};

  if (body?.tier !== undefined) {
    if (!VALID_TIERS.includes(body.tier)) {
      return Response.json({ error: "Invalid tier." }, { status: 400 });
    }
    updates.tier = body.tier;
  }

  if (body?.life_number !== undefined) {
    const lifeNumber = Number(body.life_number);
    if (!Number.isInteger(lifeNumber) || lifeNumber < 0) {
      return Response.json({ error: "Invalid life number." }, { status: 400 });
    }
    updates.life_number = lifeNumber;
  }

  if (body?.verified !== undefined) {
    if (typeof body.verified !== "boolean") {
      return Response.json({ error: "Invalid verification flag." }, { status: 400 });
    }
    updates.verified = body.verified;
  }

  if (body?.red_strikes !== undefined) {
    const redStrikes = Number(body.red_strikes);
    if (!Number.isInteger(redStrikes) || redStrikes < 0) {
      return Response.json({ error: "Invalid strike count." }, { status: 400 });
    }
    updates.red_strikes = redStrikes;
  }

  if (body?.points !== undefined) {
    const points = Number(body.points);
    if (!Number.isInteger(points) || points < 0) {
      return Response.json({ error: "Invalid point total." }, { status: 400 });
    }
    updates.points = points;
  }

  if (Object.keys(updates).length === 0) {
    return Response.json({ error: "No changes given." }, { status: 400 });
  }

  const player = await updatePlayerAdmin(id, updates);
  if (!player) {
    return Response.json(
      { error: "Failed to update this member. Try again." },
      { status: 500 }
    );
  }

  return Response.json({ player }, { status: 200 });
}

/**
 * Removes a member from the active season only. Identity, tier, and every
 * past season's history survive — see `[id]/account` for full deletion.
 *
 * Also unwhitelists them in-game (DL-4) — the mc_uuid has to be looked up
 * before the season_enrollments row is gone, since that row is what scopes
 * the lookup to the active season. Best-effort: an unreachable game server
 * shouldn't block a roster removal, so failure here is logged, not returned.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return Response.json({ error: "Admin access required." }, { status: 403 });
  }

  const { id } = await params;

  const [player] = await getProfilesByIdsAdmin([id]);

  const removed = await removePlayerAdmin(id);
  if (!removed) {
    return Response.json(
      { error: "Failed to remove this member. Try again." },
      { status: 500 }
    );
  }

  if (player?.mc_uuid) {
    const unwhitelisted = await unwhitelistPlayer(player.mc_uuid);
    if (!unwhitelisted) {
      console.error(
        `Removed profile ${id} from the season but failed to unwhitelist ${player.mc_uuid}.`
      );
    }
  }

  return Response.json({ success: true }, { status: 200 });
}
