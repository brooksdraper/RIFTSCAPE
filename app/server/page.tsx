import { ServerScreen } from "@/components/server/ServerScreen";
import { getRiftscapeCoreStatus } from "@/lib/server-status";
import { getViewer } from "@/lib/auth/profile";
import { getEnrolledPlayers } from "@/lib/players";

export const metadata = {
  title: "RIFTSCAPE | Field Terminal",
  description: "In-game status terminal for Sulfuria.",
};

/**
 * Rendered inside the Minecraft client, not the browser — the root layout
 * drops the account pill and sponsor footer for this path (see `proxy.ts`).
 * It is one screen that fits the viewport: no site nav, no back link, and no
 * connection address, which the player already used to get here.
 */
export default async function ServerPage() {
  const [status, viewer, players] = await Promise.all([
    getRiftscapeCoreStatus(),
    getViewer(),
    getEnrolledPlayers(),
  ]);

  return (
    <main className="min-h-screen stone-bg text-foreground flex items-center justify-center p-4 sm:p-6 relative overflow-y-auto mc-scroll">
      <div className="fixed inset-0 z-0 bg-black/70" />
      <ServerScreen status={status} viewer={viewer} enrolled={players.length} />
    </main>
  );
}
