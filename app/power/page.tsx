import type { Metadata } from "next";
import { BackgroundOverlay } from "@/components/layout/BackgroundOverlay";
import {
  getRiftscapeCoreStatus,
  getRiftscapePowerData,
} from "@/lib/server-status";
import { ServerAPIHUD } from "@/components/admin/ServerAPIHUD";
import { PlayerPowerBoard } from "@/components/power/PlayerPowerBoard";

export const metadata: Metadata = {
  title: "Power | RIFTSCAPE",
  description: "Live survivor power rankings from the RIFTSCAPE Core API.",
};

export default async function PowerPage() {
  const [status, snapshot] = await Promise.all([
    getRiftscapeCoreStatus(),
    getRiftscapePowerData(),
  ]);

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-accent/30 overflow-hidden relative pb-24">
      <BackgroundOverlay opacityClass="opacity-20" />
      <div className="relative z-10 container mx-auto px-6 pt-12">
        <h1 className="font-mc-header text-3xl sm:text-4xl text-foreground mb-4 mc-text-shadow leading-relaxed text-center">
          Power Rankings
        </h1>
        <p className="font-mc-body text-neutral-400 text-sm leading-relaxed max-w-md mx-auto mb-10 text-center">
          Live survivor power scores, pulled straight from the RIFTSCAPE Core
          API.
        </p>

        <ServerAPIHUD status={status} />

        <div className="mc-panel pixel-corners border-2 border-black p-6 max-w-5xl mx-auto">
          <PlayerPowerBoard
            players={snapshot?.players ?? []}
            generatedAt={snapshot?.generatedAt ?? null}
          />
        </div>
      </div>
    </main>
  );
}
