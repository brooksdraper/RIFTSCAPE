export type ServerStatus = {
  online: boolean;
  players: number;
};

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
