import { getSupabase } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { FactionBaseColor } from "@/lib/factions/colors";
import { getRiftscapePowerData } from "@/lib/server-status";
import { getProfilesByIdsAdmin } from "@/lib/players";
import { normalizeMcUuid } from "@/lib/auth/mc-verify";
import { getActiveSeason } from "@/lib/seasons";

/** Exported so the create/join routes can select the same shape without duplicating it. */
export const FACTION_FIELDS =
  "id, name, base_color, owner_id, owner_mc_user, owner_mc_uuid, members, season_id, created_at";

export type Faction = {
  id: string;
  name: string;
  base_color: FactionBaseColor;
  owner_id: string;
  /** Snapshot of the owner's Minecraft identity at registration time. */
  owner_mc_user: string;
  owner_mc_uuid: string;
  /** Profile ids of joined members. Populated by the join flow, built later. */
  members: string[];
  /** A faction is registered fresh each season — one survivor can own/join one per season. */
  season_id: string;
  created_at?: string;
};

/**
 * The faction the given profile owns *in the active season*, or null if they
 * have not registered one this season. Service role, same as
 * getProfileByUserId: only ever call with a userId from a verified session.
 */
export async function getFactionByOwnerId(
  userId: string
): Promise<Faction | null> {
  const activeSeason = await getActiveSeason();
  if (!activeSeason) return null;

  const { data, error } = await getSupabaseAdmin()
    .from("factions")
    .select(FACTION_FIELDS)
    .eq("owner_id", userId)
    .eq("season_id", activeSeason.id)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch faction by owner id:", error.message);
    return null;
  }

  return data;
}

/**
 * The faction the given profile has joined as a member (not as owner) *in
 * the active season*, or null. Service role, same caveat as getFactionByOwnerId.
 */
export async function getFactionByMemberId(
  userId: string
): Promise<Faction | null> {
  const activeSeason = await getActiveSeason();
  if (!activeSeason) return null;

  const { data, error } = await getSupabaseAdmin()
    .from("factions")
    .select(FACTION_FIELDS)
    .contains("members", [userId])
    .eq("season_id", activeSeason.id)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch faction by member id:", error.message);
    return null;
  }

  return data;
}

/** The active season's full faction roster, oldest first — public, no auth required. */
export async function getAllFactions(): Promise<Faction[]> {
  const activeSeason = await getActiveSeason();
  if (!activeSeason) return [];

  const { data, error } = await getSupabase()
    .from("factions")
    .select(FACTION_FIELDS)
    .eq("season_id", activeSeason.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch factions:", error.message);
    return [];
  }

  return data ?? [];
}

export type FactionStanding = {
  id: string;
  name: string;
  baseColor: FactionBaseColor;
  ownerMcUser: string;
  ownerMcUuid: string;
  memberCount: number;
  playtimeHours: number;
  pvpKills: number;
  pvpDeaths: number;
  mobKills: number;
  /** 0–1 aggregate engagement ratio, averaged across tracked members. */
  activityIndex: number;
  /** Sum of each tracked member's power score, as computed by the core mod. */
  powerScore: number;
};

/**
 * Faction standings with live power stats folded in. A faction's owner and
 * members are matched to /power/ entries by mc_uuid — the only stable link
 * between a profile and its in-game stats — then summed (averaged for
 * activityIndex, since it's a ratio, not a count). Members without a
 * verified mc_uuid, or with no power entry yet, simply don't contribute.
 */
export async function getFactionStandings(): Promise<FactionStanding[]> {
  const factions = await getAllFactions();
  if (factions.length === 0) return [];

  const memberIds = [...new Set(factions.flatMap((f) => f.members))];
  const [memberProfiles, power] = await Promise.all([
    getProfilesByIdsAdmin(memberIds),
    getRiftscapePowerData(),
  ]);

  const mcUuidByProfileId = new Map(
    memberProfiles.map((p) => [p.id, p.mc_uuid])
  );
  const powerByUuid = new Map(
    (power?.players ?? []).map((p) => [normalizeMcUuid(p.uuid), p])
  );

  return factions.map((faction) => {
    const memberUuids = [
      faction.owner_mc_uuid,
      ...faction.members.map((id) => mcUuidByProfileId.get(id)),
    ].filter((uuid): uuid is string => Boolean(uuid));

    const tracked = memberUuids
      .map((uuid) => powerByUuid.get(normalizeMcUuid(uuid)))
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

    const sum = (pick: (p: (typeof tracked)[number]) => number) =>
      tracked.reduce((total, p) => total + pick(p), 0);

    return {
      id: faction.id,
      name: faction.name,
      baseColor: faction.base_color,
      ownerMcUser: faction.owner_mc_user,
      ownerMcUuid: faction.owner_mc_uuid,
      memberCount: faction.members.length + 1,
      playtimeHours: sum((p) => p.playtimeHours),
      pvpKills: sum((p) => p.pvpKills),
      pvpDeaths: sum((p) => p.pvpDeaths),
      mobKills: sum((p) => p.mobKills),
      activityIndex:
        tracked.length > 0 ? sum((p) => p.activityIndex) / tracked.length : 0,
      powerScore: sum((p) => p.score),
    };
  });
}
