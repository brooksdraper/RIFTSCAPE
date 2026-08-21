import { getSupabase } from "@/lib/supabase";

export type Season = {
  id: string;
  name: string;
  startsAt: string;
  endsAt: string | null;
  isActive: boolean;
};

/**
 * The currently active season, or null if none is active — between seasons,
 * or before an admin has activated the next one. Every caller treats null as
 * "the run is currently closed," not an error. Publicly readable, so this
 * always uses the anon client even when called from admin-only code paths.
 */
export async function getActiveSeason(): Promise<Season | null> {
  const { data, error } = await getSupabase()
    .from("seasons")
    .select("id, name, starts_at, ends_at, is_active")
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch active season:", error.message);
    return null;
  }

  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    startsAt: data.starts_at,
    endsAt: data.ends_at,
    isActive: data.is_active,
  };
}
