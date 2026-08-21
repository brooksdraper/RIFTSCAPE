import type { Metadata } from "next";
import { BackgroundOverlay } from "@/components/layout/BackgroundOverlay";
import { FactionsStandingsHeader } from "@/components/factions/FactionsStandingsHeader";
import { FactionPodium } from "@/components/factions/FactionPodium";
import { FactionRankedList } from "@/components/factions/FactionRankedList";
import { UpdateDisclaimerPlate } from "@/components/factions/UpdateDisclaimerPlate";
import { getFactionStandings } from "@/lib/factions";

export const metadata: Metadata = {
  title: "Factions | RIFTSCAPE",
  description: "See which RIFTSCAPE faction is leading the season.",
};

export default async function FactionsPage() {
  const standings = await getFactionStandings();
  const sorted = [...standings].sort((a, b) => b.powerScore - a.powerScore);
  const podium = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-accent/30 overflow-hidden relative pb-24">
      <BackgroundOverlay opacityClass="opacity-20" />
      <div className="relative z-10 container mx-auto px-6 pt-12">
        <FactionsStandingsHeader />
        {sorted.length > 0 ? (
          <>
            <FactionPodium standings={podium} />
            <FactionRankedList standings={rest} startingRank={4} />
          </>
        ) : (
          <div className="mc-panel pixel-corners border-2 border-black px-6 py-10 mb-10 text-center">
            <p className="font-mc-body text-sm text-foreground/60 leading-relaxed">
              No factions have registered yet. Be the first to claim your
              banner.
            </p>
          </div>
        )}
        <UpdateDisclaimerPlate />
      </div>
    </main>
  );
}
