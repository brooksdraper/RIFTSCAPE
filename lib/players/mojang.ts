const PROFILE_LOOKUP_URL = "https://api.minecraftservices.com/minecraft/profile/lookup/name/";

export type MojangProfile = {
  /** UUID in canonical dashed form, e.g. "069a79f4-44e9-4726-a5be-fca90e38aaf5". */
  uuid: string;
  /**
   * Mojang's own casing for this username, which can differ from what was
   * typed — usernames are case-preserving but case-insensitive to look up.
   */
  username: string;
};

function addDashes(undashed: string): string {
  return [
    undashed.slice(0, 8),
    undashed.slice(8, 12),
    undashed.slice(12, 16),
    undashed.slice(16, 20),
    undashed.slice(20, 32),
  ].join("-");
}

/**
 * Resolves a Minecraft username to its UUID via Mojang's profile lookup.
 *
 * Returns `null` only when Mojang confirms the name doesn't exist (404) — the
 * caller can treat that as a validation failure. Any other failure (network,
 * 429, 5xx) throws, so a Mojang outage doesn't get silently mistaken for
 * "no such player" and reject a legitimate enrollment.
 */
export async function lookupMinecraftProfile(
  username: string
): Promise<MojangProfile | null> {
  const res = await fetch(
    `${PROFILE_LOOKUP_URL}${encodeURIComponent(username)}`,
    // Every enrollment needs a fresh answer; Mojang's own username history
    // (case, ownership) can change and this call is infrequent enough that
    // caching buys nothing.
    { cache: "no-store" }
  );

  if (res.status === 404) return null;

  if (!res.ok) {
    throw new Error(
      `Mojang profile lookup failed for "${username}": ${res.status}`
    );
  }

  const data = (await res.json()) as { id: string; name: string };

  return { uuid: addDashes(data.id), username: data.name };
}

/**
 * Resolves a Minecraft UUID to its current username via Mojang's session
 * server. Used only for display (the field terminal's "not enrolled" plate,
 * which has a verified mc_uuid but no site profile to read a username off
 * of) — never for anything identity-bearing, since an unenrolled account has
 * nothing on RIFTSCAPE to protect.
 *
 * Returns null on any non-200 response (unknown uuid, Mojang outage) rather
 * than throwing — a missing display name there is a cosmetic gap, not a
 * failure worth surfacing.
 */
export async function lookupMinecraftUsername(
  uuid: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `https://sessionserver.mojang.com/session/minecraft/profile/${encodeURIComponent(
        uuid.replace(/-/g, "")
      )}`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;

    const data = (await res.json()) as { name?: string };
    return data.name ?? null;
  } catch (error) {
    console.error("Mojang username lookup failed:", error);
    return null;
  }
}
