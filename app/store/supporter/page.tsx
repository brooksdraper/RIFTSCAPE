import Link from "next/link";
import { BackgroundOverlay } from "@/components/layout/BackgroundOverlay";
import { SupporterStoreHeader } from "@/components/store/SupporterStoreHeader";
import { SupporterTierStatus } from "@/components/store/SupporterTierStatus";
import { SupporterCatalog } from "@/components/store/SupporterCatalog";
import { getCurrentProfile } from "@/lib/auth/profile";
import type { SupporterViewer } from "@/lib/store/supporter-items";
import { StoreLockedNotice } from "@/components/store/StoreLockedNotice";
import { StoreOpen } from "@/lib/store/store-items";

export default async function SupporterStore() {
  const profile = await getCurrentProfile();

  // Unlocks run off the account's tag. `playtimeHours` is the Survivor-gate
  // framework — nothing records online time yet, so it stays null until a
  // playtime source exists; only the progress readout depends on it.
  const viewer: SupporterViewer = {
    tier: profile?.tier ?? null,
    playtimeHours: null,
  };

  if (!StoreOpen) {
    return (
      <main className="min-h-screen bg-background text-foreground selection:bg-accent/30 overflow-hidden relative pb-24">
        <BackgroundOverlay opacityClass="opacity-20" />
        <div className="relative z-10 container mx-auto px-6 pt-12">
          <SupporterStoreHeader />
          <StoreLockedNotice />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-accent/30 overflow-hidden relative pb-24">
      <BackgroundOverlay opacityClass="opacity-20" />
      <div className="relative z-10 container mx-auto px-6 pt-12">
        <SupporterStoreHeader />
        <div className="max-w-6xl mx-auto">
          <SupporterTierStatus
            minecraftUsername={profile?.mc_user ?? null}
            viewer={viewer}
          />
          <SupporterCatalog viewer={viewer} />

          {/* Where the tags themselves are actually bought */}
          <div className="mc-panel pixel-corners p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-mc-header text-sm mb-2 mc-text-shadow leading-relaxed">
                Tags are sold at the Supply Drop
              </h2>
              <p className="font-mc-body text-xs text-neutral-300/90 leading-relaxed">
                Supporter and Sponsor tags apply to your account within a minute
                of checkout and cover every entry at or below their tier.
              </p>
            </div>
            <Link
              href="/store"
              className="mc-btn pixel-corners shrink-0 px-6 py-4 font-mc-sub text-xs uppercase tracking-widest text-center text-accent"
            >
              View Tags →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
