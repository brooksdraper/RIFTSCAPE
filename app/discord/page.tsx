import type { Metadata } from "next";
import { BackgroundOverlay } from "@/components/layout/BackgroundOverlay";
import { DiscordRedirectPlate } from "@/components/discord/DiscordRedirectPlate";

export const metadata: Metadata = {
  title: "Joining Discord | RIFTSCAPE",
  description: "Redirecting to the RIFTSCAPE Discord server.",
};

interface DiscordPageProps {
  // Marketing campaigns link to /discord?d=<source_id> so the click can be
  // attributed before bouncing to the real Discord invite. The attribution
  // insert itself happens client-side via /api/discord-click — Server
  // Components can't set the cookie that caps it at one log per session.
  searchParams: Promise<{ d?: string }>;
}

export default async function DiscordPage({ searchParams }: DiscordPageProps) {
  const { d: sourceId } = await searchParams;

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-accent/30 overflow-hidden relative pb-24">
      <BackgroundOverlay opacityClass="opacity-20" />

      <div className="relative z-10 container mx-auto px-6 pt-12">
        <DiscordRedirectPlate sourceId={sourceId} />
      </div>
    </main>
  );
}
