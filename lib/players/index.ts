import { getSupabase } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export type EnrolledPlayer = {
  /** Also the auth.users id — a profile is its Discord account. */
  id: string;
  /** Minecraft username as of enrollment. A display snapshot, not live. */
  mc_user: string;
  /** Permanent Minecraft identity, resolved via Mojang at enrollment. */
  mc_uuid?: string;
  /** Set once an in-game token has proven mc_uuid belongs to this account. */
  mc_verified_at?: string | null;
  tier: "member" | "survivor" | "supporter" | "sponsor";
  life_number: number;
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
const PUBLIC_PROFILE_FIELDS = "id, mc_user, tier, life_number, created_at";

export async function getEnrolledPlayers(): Promise<EnrolledPlayer[]> {
  const { data, error } = await getSupabase()
    .from("profiles")
    .select(PUBLIC_PROFILE_FIELDS)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch enrolled players:", error.message);
    return [];
  }

  return data ?? [];
}

/**
 * The signed-in survivor's own profile, Discord and Minecraft-identity fields
 * included for their ID card. Null means signed in but not enrolled.
 *
 * Uses the service role because those columns are revoked from anon — so only
 * ever call this with a `userId` from a verified session, never one off a
 * request body.
 */
export async function getProfileByUserId(
  userId: string
): Promise<EnrolledPlayer | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("profiles")
    .select(
      "id, mc_user, mc_uuid, mc_verified_at, tier, life_number, dc_nuid, dc_user, dc_avatar_url, created_at"
    )
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch profile by user id:", error.message);
    return null;
  }

  return data;
}

/**
 * Marks the signed-in survivor's Minecraft account as verified. Only ever
 * call this after `verifyMinecraftToken` has confirmed an in-game token
 * matches this profile's mc_uuid — never off a client-supplied flag.
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
 * Looks up an enrolled profile by its permanent Minecraft identity. Used by
 * the in-game field terminal (`/server`), which authenticates a player via a
 * verified mc_uuid token rather than a Supabase session — so, like
 * `getProfileByUserId`, this needs the service role to read the mc_uuid
 * column at all, and callers must only ever pass a `mcUuid` that's already
 * been through `verifyMinecraftToken`, never one off a request param.
 */
export async function getProfileByMcUuid(
  mcUuid: string
): Promise<EnrolledPlayer | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("profiles")
    .select(
      "id, mc_user, mc_uuid, mc_verified_at, tier, life_number, dc_nuid, dc_user, dc_avatar_url, created_at"
    )
    .eq("mc_uuid", mcUuid)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch profile by mc_uuid:", error.message);
    return null;
  }

  return data;
}

/** Used for gift lookups, where only the recipient's Minecraft name is known. */
export async function getProfileByMinecraftUsername(
  minecraftUsername: string
): Promise<EnrolledPlayer | null> {
  const { data, error } = await getSupabase()
    .from("profiles")
    .select(PUBLIC_PROFILE_FIELDS)
    .ilike("mc_user", minecraftUsername)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch profile:", error.message);
    return null;
  }

  return data;
}
