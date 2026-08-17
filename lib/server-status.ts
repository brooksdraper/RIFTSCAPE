export type ServerStatus = {
  online: boolean;
  players: number;
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

    let data: { status?: string; playerCount?: number };
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Riftscape core status response was not valid JSON");
      return null;
    }

    return { online: data.status === "online", players: data.playerCount ?? 0 };
  } catch (error) {
    console.error(
      "Failed to fetch Riftscape core status:",
      error instanceof Error ? error.message : String(error)
    );
    return null;
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
