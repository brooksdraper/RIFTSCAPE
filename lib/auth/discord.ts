import type { User } from "@supabase/supabase-js";

export type DiscordIdentity = {
  /** Discord snowflake — stable across username changes. */
  id: string;
  username: string;
  avatarUrl: string | null;
};

function firstString(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) return value;
  }
  return null;
}

/**
 * Pulls the Discord handle out of a Supabase auth user.
 *
 * Which metadata key holds the handle depends on when the account was linked —
 * Discord's move from `name#1234` to global handles left Supabase populating
 * `user_name`, `custom_claims.global_name`, `full_name`, and `name` in
 * different combinations — so check them in order of specificity rather than
 * trusting any single one.
 */
export function getDiscordIdentity(user: User): DiscordIdentity | null {
  const identity = user.identities?.find((i) => i.provider === "discord");
  const meta: Record<string, unknown> = {
    ...(user.user_metadata ?? {}),
    ...(identity?.identity_data ?? {}),
  };
  const customClaims = (meta.custom_claims ?? {}) as Record<string, unknown>;

  const id = firstString(identity?.id, meta.provider_id, meta.sub);
  if (!id) return null;

  return {
    id,
    username:
      firstString(
        meta.user_name,
        customClaims.global_name,
        meta.preferred_username,
        meta.full_name,
        meta.name
      ) ?? "Unknown",
    avatarUrl: firstString(meta.avatar_url, meta.picture),
  };
}
