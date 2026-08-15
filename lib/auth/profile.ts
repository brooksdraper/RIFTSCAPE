import type { User } from "@supabase/supabase-js";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getDiscordIdentity, type DiscordIdentity } from "@/lib/auth/discord";
import { getProfileByUserId, type EnrolledPlayer } from "@/lib/players";

/**
 * The verified Discord account for this request, or null when signed out.
 *
 * `getUser()` revalidates the token with Supabase; `getSession()` would trust
 * whatever is in the cookie, which is forgeable.
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getCurrentProfile(): Promise<EnrolledPlayer | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  return getProfileByUserId(user.id);
}

export type Viewer = {
  /** Signed in with Discord. */
  discord: DiscordIdentity | null;
  /** Enrolled in the run. Null with a non-null `discord` means "signed in, not enrolled yet". */
  profile: EnrolledPlayer | null;
};

/** Both halves of the sign-in state, for callers that need to tell them apart. */
export async function getViewer(): Promise<Viewer> {
  const user = await getCurrentUser();
  if (!user) return { discord: null, profile: null };

  return {
    discord: getDiscordIdentity(user),
    profile: await getProfileByUserId(user.id),
  };
}
