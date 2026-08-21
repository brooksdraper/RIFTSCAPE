import { getSupabase } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getActiveSeason } from "@/lib/seasons";

export type EnrolledPlayer = {
  /** Also the auth.users id — a profile is its Discord account. */
  id: string;
  /** Minecraft username as of enrollment. A display snapshot, not live. */
  mc_user: string;
  /** Permanent Minecraft identity, resolved via Mojang at enrollment. */
  mc_uuid?: string;
  /** Set once an in-game token has proven mc_uuid belongs to this account. */
  mc_verified_at?: string | null;
  /** Set when the three whitelist-agreement checkboxes were accepted. */
  agreed_at?: string | null;
  /** Set once the RIFTSCAPE API confirmed this profile was added to the server whitelist. */
  whitelisted_at?: string | null;
  /** Lifetime — a Store purchase, so it survives past the season it was bought in. */
  tier: "member" | "survivor" | "supporter" | "sponsor";
  /** Season-scoped — from this profile's season_enrollments row for the active season. */
  life_number: number;
  /** RED-strike count under the 3-strike moderation system. Admin-only, season-scoped. */
  red_strikes?: number;
  /** Accumulated temp-ban points (the "+ N pts." consequence in /rules). Admin-only, season-scoped. */
  points?: number;
  /** Discord snowflake — stable across username changes. */
  dc_nuid?: string;
  dc_user?: string;
  dc_avatar_url?: string | null;
  created_at?: string;
};

export const TIER_RANK: Record<EnrolledPlayer["tier"], number> = {
  member: 0,
  survivor: 1,
  supporter: 2,
  sponsor: 3,
};

/**
 * Everything the anon key is granted at the column level. The Discord and
 * mc_uuid columns are deliberately absent — selecting them through
 * `getSupabase()` errors.
 */
const PUBLIC_PROFILE_FIELDS =
  "id, mc_user, tier, created_at, season_enrollments!inner(life_number, joined_at)";

const ADMIN_PROFILE_FIELDS =
  "id, mc_user, mc_verified_at, agreed_at, whitelisted_at, tier, created_at, season_enrollments!inner(life_number, red_strikes, points, joined_at)";

const FULL_PROFILE_FIELDS =
  "id, mc_user, mc_uuid, mc_verified_at, agreed_at, whitelisted_at, tier, dc_nuid, dc_user, dc_avatar_url, created_at, season_enrollments!inner(life_number, red_strikes, points, joined_at)";

/**
 * PostgREST returns an embedded to-one relation as an object, but this
 * flattens either shape defensively — cheap insurance against a client/PostgREST
 * version returning a single-element array instead.
 */
function flattenEnrollment(row: Record<string, unknown>): EnrolledPlayer {
  const { season_enrollments, ...rest } = row;
  const enrollment = Array.isArray(season_enrollments)
    ? season_enrollments[0]
    : season_enrollments;
  return { ...rest, ...(enrollment as object) } as EnrolledPlayer;
}

export async function getEnrolledPlayers(): Promise<EnrolledPlayer[]> {
  const activeSeason = await getActiveSeason();
  if (!activeSeason) return [];

  const { data, error } = await getSupabase()
    .from("profiles")
    .select(PUBLIC_PROFILE_FIELDS)
    .eq("season_enrollments.season_id", activeSeason.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch enrolled players:", error.message);
    return [];
  }

  return (data ?? []).map(flattenEnrollment);
}

/**
 * The signed-in survivor's own profile, Discord and Minecraft-identity fields
 * included for their ID card. Null means signed in but not enrolled *in the
 * active season* — either no identity at all, or identity exists from a past
 * season but they haven't joined the current one.
 *
 * Uses the service role because those columns are revoked from anon — so only
 * ever call this with a `userId` from a verified session, never one off a
 * request body.
 */
export async function getProfileByUserId(
  userId: string
): Promise<EnrolledPlayer | null> {
  const activeSeason = await getActiveSeason();
  if (!activeSeason) return null;

  const { data, error } = await getSupabaseAdmin()
    .from("profiles")
    .select(FULL_PROFILE_FIELDS)
    .eq("id", userId)
    .eq("season_enrollments.season_id", activeSeason.id)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch profile by user id:", error.message);
    return null;
  }

  return data ? flattenEnrollment(data) : null;
}

/**
 * Marks the signed-in survivor's Minecraft account as verified. Only ever
 * call this after `verifyMinecraftToken` has confirmed an in-game token
 * matches this profile's mc_uuid — never off a client-supplied flag.
 *
 * mc_verified_at lives on profiles (permanent identity), not
 * season_enrollments, so this needs no season scoping.
 */
export async function markMinecraftVerified(userId: string): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("profiles")
    .update({ mc_verified_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) {
    console.error("Failed to mark Minecraft account verified:", error.message);
  }
}

/**
 * Records that the signed-in survivor accepted the whitelist agreement.
 * Written before the RIFTSCAPE API push in /api/whitelist, specifically so a
 * failed push never discards an accepted agreement.
 */
export async function markAgreementAccepted(userId: string): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("profiles")
    .update({ agreed_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) {
    console.error("Failed to record agreement acceptance:", error.message);
  }
}

/**
 * Records that the RIFTSCAPE API confirmed this profile was added to the
 * server whitelist. Only ever call this after that call has succeeded.
 */
export async function markWhitelisted(userId: string): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("profiles")
    .update({ whitelisted_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) {
    console.error("Failed to record whitelisting:", error.message);
  }
}

/**
 * Full roster for the admin panel, mc_verified_at included. Uses the service
 * role since that column is revoked from anon — never expose this beyond an
 * admin-gated route.
 */
export async function getEnrolledPlayersAdmin(): Promise<EnrolledPlayer[]> {
  const activeSeason = await getActiveSeason();
  if (!activeSeason) return [];

  const { data, error } = await getSupabaseAdmin()
    .from("profiles")
    .select(ADMIN_PROFILE_FIELDS)
    .eq("season_enrollments.season_id", activeSeason.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch enrolled players (admin):", error.message);
    return [];
  }

  return (data ?? []).map(flattenEnrollment);
}

export type PlayerAdminUpdate = {
  tier?: EnrolledPlayer["tier"];
  life_number?: number;
  /** true marks verified now, false revokes it — mirrors `mc_verified_at`. */
  verified?: boolean;
  red_strikes?: number;
  points?: number;
};

/**
 * Applies an admin edit to a profile. tier/verified write to profiles
 * (permanent); life_number/red_strikes/points write to the profile's
 * season_enrollments row for the active season. Uses the service role —
 * only ever call this from an admin-gated route.
 *
 * The admin panel only ever edits players already visible in the
 * season-scoped roster, so a season_enrollments row is guaranteed to exist
 * whenever an enrollment-side field is being updated. The two writes aren't
 * wrapped in a transaction — both are idempotent overwrites, so a failed
 * write is safe to retry.
 */
export async function updatePlayerAdmin(
  id: string,
  updates: PlayerAdminUpdate
): Promise<EnrolledPlayer | null> {
  const activeSeason = await getActiveSeason();

  const profilePatch: Record<string, unknown> = {};
  if (updates.tier !== undefined) profilePatch.tier = updates.tier;
  if (updates.verified !== undefined) {
    profilePatch.mc_verified_at = updates.verified
      ? new Date().toISOString()
      : null;
  }

  const enrollmentPatch: Record<string, unknown> = {};
  if (updates.life_number !== undefined)
    enrollmentPatch.life_number = updates.life_number;
  if (updates.red_strikes !== undefined)
    enrollmentPatch.red_strikes = updates.red_strikes;
  if (updates.points !== undefined) enrollmentPatch.points = updates.points;

  if (Object.keys(profilePatch).length > 0) {
    const { error } = await getSupabaseAdmin()
      .from("profiles")
      .update(profilePatch)
      .eq("id", id);

    if (error) {
      console.error("Failed to update player (admin):", error.message);
      return null;
    }
  }

  if (Object.keys(enrollmentPatch).length > 0) {
    if (!activeSeason) {
      console.error(
        "Failed to update player (admin): no active season to write season-scoped fields to."
      );
      return null;
    }

    const { error } = await getSupabaseAdmin()
      .from("season_enrollments")
      .update(enrollmentPatch)
      .eq("profile_id", id)
      .eq("season_id", activeSeason.id);

    if (error) {
      console.error("Failed to update player (admin):", error.message);
      return null;
    }
  }

  return getProfileByUserId(id);
}

/**
 * Removes a survivor from the *active season's* roster — identity, tier,
 * and every past season's history survive. Uses the service role — only
 * ever call this from an admin-gated route.
 */
export async function removePlayerAdmin(id: string): Promise<boolean> {
  const activeSeason = await getActiveSeason();
  if (!activeSeason) {
    console.error("Failed to remove player (admin): no active season.");
    return false;
  }

  const { error } = await getSupabaseAdmin()
    .from("season_enrollments")
    .delete()
    .eq("profile_id", id)
    .eq("season_id", activeSeason.id);

  if (error) {
    console.error("Failed to remove player (admin):", error.message);
    return false;
  }

  return true;
}

/**
 * Permanently deletes a survivor's identity — cascades to every
 * season_enrollments row and every faction they own, across every season.
 * A much bigger action than `removePlayerAdmin`: a real account-removal
 * request, not a season kick. Uses the service role — only ever call this
 * from an admin-gated route.
 */
export async function deletePlayerAccountAdmin(id: string): Promise<boolean> {
  const { error } = await getSupabaseAdmin()
    .from("profiles")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete player account (admin):", error.message);
    return false;
  }

  return true;
}

/** Public display info for a batch of profile ids, e.g. a faction's members. */
export async function getProfilesByIds(
  ids: string[]
): Promise<Pick<EnrolledPlayer, "id" | "mc_user">[]> {
  if (ids.length === 0) return [];

  const activeSeason = await getActiveSeason();
  if (!activeSeason) return [];

  const { data, error } = await getSupabase()
    .from("profiles")
    // The embed needs at least one explicitly-granted column — an empty
    // `season_enrollments!inner()` trips PostgREST's permission check under
    // the anon key's column-level grants, even though nothing here reads it.
    .select("id, mc_user, season_enrollments!inner(id)")
    .eq("season_enrollments.season_id", activeSeason.id)
    .in("id", ids);

  if (error) {
    console.error("Failed to fetch profiles by ids:", error.message);
    return [];
  }

  return (data ?? []).map(({ id, mc_user }) => ({ id, mc_user }));
}

/**
 * Batch mc_uuid lookup for a set of profile ids, e.g. resolving a faction's
 * member list against live power data. Uses the service role since mc_uuid
 * is revoked from anon — only ever call this from server-side aggregation,
 * never expose the raw uuids it returns to the client.
 */
export async function getProfilesByIdsAdmin(
  ids: string[]
): Promise<Pick<EnrolledPlayer, "id" | "mc_user" | "mc_uuid">[]> {
  if (ids.length === 0) return [];

  const activeSeason = await getActiveSeason();
  if (!activeSeason) return [];

  const { data, error } = await getSupabaseAdmin()
    .from("profiles")
    .select("id, mc_user, mc_uuid, season_enrollments!inner(id)")
    .eq("season_enrollments.season_id", activeSeason.id)
    .in("id", ids);

  if (error) {
    console.error("Failed to fetch profiles by ids (admin):", error.message);
    return [];
  }

  return (data ?? []).map(({ id, mc_user, mc_uuid }) => ({ id, mc_user, mc_uuid }));
}

/** Used for gift lookups, where only the recipient's Minecraft name is known. */
export async function getProfileByMinecraftUsername(
  minecraftUsername: string
): Promise<EnrolledPlayer | null> {
  const activeSeason = await getActiveSeason();
  if (!activeSeason) return null;

  const { data, error } = await getSupabase()
    .from("profiles")
    .select(PUBLIC_PROFILE_FIELDS)
    .eq("season_enrollments.season_id", activeSeason.id)
    .ilike("mc_user", minecraftUsername)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch profile:", error.message);
    return null;
  }

  return data ? flattenEnrollment(data) : null;
}
