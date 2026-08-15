import { BackgroundOverlay } from "@/components/layout/BackgroundOverlay";
import { StoreHeader } from "@/components/store/StoreHeader";
import { StoreGrid } from "@/components/store/StoreGrid";
import { SupporterStoreSection } from "@/components/store/SupporterStoreSection";
import { PurchaseNotice } from "@/components/store/PurchaseNotice";
import { PurchaseSuccessModal } from "@/components/store/PurchaseSuccessModal";
import { StoreLockedNotice } from "@/components/store/StoreLockedNotice";
import { getCurrentProfile } from "@/lib/auth/profile";
import { StoreOpen } from "@/lib/store/store-items";

export default async function Store({
  searchParams,
}: {
  searchParams: Promise<{ purchase?: string }>;
}) {
  const profile = await getCurrentProfile();
  const { purchase } = await searchParams;

  if (!StoreOpen) {
    return (
      <main className="min-h-screen bg-background text-foreground selection:bg-accent/30 overflow-hidden relative pb-24">
        <BackgroundOverlay opacityClass="opacity-20" />
        <div className="relative z-10 container mx-auto px-6 pt-12">
          <StoreHeader />
          <StoreLockedNotice />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-accent/30 overflow-hidden relative pb-24">
      <BackgroundOverlay opacityClass="opacity-20" />
      <div className="relative z-10 container mx-auto px-6 pt-12">
        <StoreHeader />
        <PurchaseNotice purchase={purchase} />
        <PurchaseSuccessModal purchase={purchase} />
        <StoreGrid
          isLoggedIn={profile !== null}
          minecraftUsername={profile?.mc_user ?? null}
          lifeNumber={profile?.life_number ?? null}
        />
        <SupporterStoreSection />
      </div>
    </main>
  );
}
