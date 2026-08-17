import { jwtVerify } from "jose";

/**
 * Minted in-game by the RIFTSCAPE server (via the same RIFTSCAPE API used for
 * whitelisting) when a player runs the verification command. Proves the
 * bearer is currently logged into the Minecraft account behind `mc_uuid` —
 * HS256-signed with AUTH_JWT_SECRET, a secret shared only between the game
 * server and this site.
 */
let secret: Uint8Array | null = null;

function getSecret(): Uint8Array {
  if (secret) return secret;

  const raw = process.env.AUTH_JWT_SECRET;
  if (!raw) {
    throw new Error("Missing AUTH_JWT_SECRET.");
  }

  secret = new TextEncoder().encode(raw);
  return secret;
}

/** Drops dashes and case so dashed/undashed, upper/lower-case UUIDs compare equal. */
export function normalizeMcUuid(uuid: string): string {
  return uuid.replace(/-/g, "").toLowerCase();
}

export function sameMinecraftAccount(a: string, b: string): boolean {
  return normalizeMcUuid(a) === normalizeMcUuid(b);
}

/**
 * Verifies a Minecraft-account-ownership token and returns the mc_uuid it
 * attests to, or null if the token is missing, expired, malformed, or not
 * signed with AUTH_JWT_SECRET. Never throws — every failure mode collapses to
 * "not verified" for the caller.
 */
export async function verifyMinecraftToken(
  token: string
): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
    });

    const mcUuid = payload.mc_uuid;
    return typeof mcUuid === "string" && mcUuid ? mcUuid : null;
  } catch {
    return null;
  }
}
