export type ServerStatus = {
  online: boolean;
  players: number;
  service?: string;
  port?: number;
};

export async function getRiftscapeCoreStatus(): Promise<ServerStatus | null> {
  const rawIp = process.env.RIFTSCAPE_RAW_IP;
  const port = process.env.RIFTSCAPE_API_PORT;
  const token = process.env.RIFTSCAPE_API_TOKEN;

  if (!rawIp || !port || !token) {
    return null;
  }

  try {
    const res = await fetch(`${rawIp}:${port}/status`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      return null;
    }

    // The core mod's "server" field is a §-formatted MOTD containing a raw,
    // unescaped newline, which makes the field invalid JSON; strip it out
    // before parsing since it's unused here anyway.
    const text = (await res.text()).replace(
      /"server"\s*:\s*"(?:\\.|[^"\\])*"\s*,\s*|,?\s*"server"\s*:\s*"(?:\\.|[^"\\])*"/,
      ""
    );

    let data: { status?: string; playerCount?: number; service?: string; port?: number };
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Riftscape core status response was not valid JSON");
      return null;
    }

    return {
      online: data.status === "online",
      players: data.playerCount ?? 0,
      service: data.service,
      port: data.port,
    };
  } catch (error) {
    console.error(
      "Failed to fetch Riftscape core status:",
      error instanceof Error ? error.message : String(error)
    );
    return null;
  }
}

export type PlayerPower = {
  uuid: string;
  name: string;
  score: number;
  playtimeHours: number;
  pvpKills: number;
  pvpDeaths: number;
  mobKills: number;
  activityIndex: number;
};

export type PowerSnapshot = {
  generatedAt: number;
  players: PlayerPower[];
};

/**
 * The core mod recomputes this once daily, so a short revalidate window is
 * enough to avoid hitting the API on every request without ever serving
 * badly stale data between recomputations.
 */
export async function getRiftscapePowerData(): Promise<PowerSnapshot | null> {
  const rawIp = process.env.RIFTSCAPE_RAW_IP;
  const port = process.env.RIFTSCAPE_API_PORT;
  const token = process.env.RIFTSCAPE_API_TOKEN;

  if (!rawIp || !port || !token) {
    return null;
  }

  try {
    const res = await fetch(`${rawIp}:${port}/power/`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error(
      "Failed to fetch Riftscape power data:",
      error instanceof Error ? error.message : String(error)
    );
    return null;
  }
}

/**
 * Removes a player from the server whitelist, mc_uuid same as the add call
 * in /api/whitelist. Best-effort: callers should log a failure and continue
 * rather than block on it — a roster removal shouldn't hang on the game
 * server being reachable.
 */
export async function unwhitelistPlayer(mcUuid: string): Promise<boolean> {
  const rawIp = process.env.RIFTSCAPE_RAW_IP;
  const port = process.env.RIFTSCAPE_API_PORT;
  const token = process.env.RIFTSCAPE_API_TOKEN;

  if (!rawIp || !port || !token) {
    console.error("Unwhitelist request failed: RIFTSCAPE API is not configured.");
    return false;
  }

  try {
    const res = await fetch(`${rawIp}:${port}/whitelist`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ player: mcUuid }),
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: undefined }));
      console.error(
        "Unwhitelist request rejected by RIFTSCAPE API:",
        res.status,
        error,
      );
      return false;
    }

    return true;
  } catch (err) {
    console.error("Failed to reach RIFTSCAPE API for unwhitelisting:", err);
    return false;
  }
}

export async function getServerStatus(host: string): Promise<ServerStatus | null> {
  try {
    const res = await fetch(
      `https://api.mcstatus.io/v2/status/java/${encodeURIComponent(host)}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    if (!data.online) {
      return { online: false, players: 0 };
    }

    return { online: true, players: data.players?.online ?? 0 };
  } catch (error) {
    console.error("Failed to fetch server status:", error);
    return null;
  }
}
