import { ServerScreen } from "@/components/server/ServerScreen";
import type { FieldTerminalPlayer } from "@/components/server/PlayerPlate";
import { getRiftscapeCoreStatus } from "@/lib/server-status";
import { getProfileByMcUuid } from "@/lib/players";
import { parseServerTerminalToken } from "@/lib/auth/mc-verify";

export const metadata = {
  title: "RIFTSCAPE | Field Terminal",
  description: "In-game status terminal for Sulfuria.",
};

/**
 * The terminal is opened from inside the Minecraft client, which has no
 * Discord session to read — the RIFTSCAPE server mints a fresh
 * `SERVER_TERMINAL_TOKEN` every time a player opens it, so it's always
 * present in practice. Parsing it here is what stands in for sign-in on this
 * page.
 */
async function resolveFieldTerminalPlayer(
  serverTerminalToken: string | undefined
): Promise<FieldTerminalPlayer> {
  if (!serverTerminalToken) return { status: "invalid" };

  const parsed = parseServerTerminalToken(serverTerminalToken);
  if (!parsed) return { status: "invalid" };

  const profile = await getProfileByMcUuid(parsed.mcUuid);
  if (profile) return { status: "enrolled", profile };

  return { status: "unenrolled", mcUser: parsed.mcUsername };
}

/**
 * Rendered inside the Minecraft client, not the browser — the root layout
 * drops the account pill and sponsor footer for this path (see `proxy.ts`).
 * It is one screen that fits the viewport: no site nav, no back link, and no
 * connection address, which the player already used to get here.
 */
export default async function ServerPage({
  searchParams,
}: {
  searchParams: Promise<{ SERVER_TERMINAL_TOKEN?: string }>;
}) {
  const { SERVER_TERMINAL_TOKEN } = await searchParams;

  const [status, player] = await Promise.all([
    getRiftscapeCoreStatus(),
    resolveFieldTerminalPlayer(SERVER_TERMINAL_TOKEN),
  ]);

  return (
    <main className="min-h-screen stone-bg text-foreground flex items-center justify-center p-4 sm:p-6 relative overflow-y-auto mc-scroll">
      <div className="fixed inset-0 z-0 bg-black/70" />
      <ServerScreen status={status} player={player} />
    </main>
  );
}
