import { getSupabase } from "@/lib/supabase";

export type EnrolledPlayer = {
  id: string;
  minecraft_username: string;
  tier: "member" | "survivor" | "supporter" | "sponsor";
  life_number: number;
  discord_username?: string;
  created_at?: string;
};

export const TIER_RANK: Record<EnrolledPlayer["tier"], number> = {
  member: 0,
  survivor: 1,
  supporter: 2,
  sponsor: 3,
};

export async function getEnrolledPlayers(): Promise<EnrolledPlayer[]> {
  const { data, error } = await getSupabase()
    .from("profiles")
    .select("id, minecraft_username, tier, life_number")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch enrolled players:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getProfileByMinecraftUsername(
  minecraftUsername: string
): Promise<EnrolledPlayer | null> {
  const { data, error } = await getSupabase()
    .from("profiles")
    .select("id, minecraft_username, tier, life_number, discord_username, created_at")
    .ilike("minecraft_username", minecraftUsername)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch profile:", error.message);
    return null;
  }

  return data;
}

export async function getProfileByCredentials(
  minecraftUsername: string,
  discordUsername: string
): Promise<EnrolledPlayer | null> {
  const { data, error } = await getSupabase()
    .from("profiles")
    .select("id, minecraft_username, tier, life_number")
    .ilike("minecraft_username", minecraftUsername)
    .ilike("discord_username", discordUsername)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch profile by credentials:", error.message);
    return null;
  }

  return data;
}
