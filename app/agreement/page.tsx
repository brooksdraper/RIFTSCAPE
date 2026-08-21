import type { Metadata } from "next";
import { BackgroundOverlay } from "@/components/layout/BackgroundOverlay";
import { NoCredentialsNotice } from "@/components/user/NoCredentialsNotice";
import { SignInGate } from "@/components/auth/SignInGate";
import { AgreementForm } from "@/components/agreement/AgreementForm";
import { getCurrentUser } from "@/lib/auth/profile";
import { getProfileByUserId } from "@/lib/players";

export const metadata: Metadata = {
  title: "Server Agreement | RIFTSCAPE",
  description: "Accept the RIFTSCAPE rules and terms to get whitelisted.",
};

export default async function AgreementPage() {
  const user = await getCurrentUser();
  const profile = user ? await getProfileByUserId(user.id) : null;

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-accent/30 overflow-hidden relative pb-24">
      <BackgroundOverlay opacityClass="opacity-20" />

      <div className="relative z-10 container mx-auto px-6 pt-12">
        <div className="text-center mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-2 mc-panel-raised pixel-corners pixel-slot border-2 border-black font-mc-sub text-accent text-[11px] tracking-widest uppercase px-6 py-2 mc-text-shadow mb-6">
            <span className="w-2 h-2 bg-accent shrink-0" />
            Whitelist
            <span className="w-2 h-2 bg-accent shrink-0" />
          </span>

          <h1 className="font-mc-header text-3xl sm:text-4xl md:text-5xl text-foreground mb-4 mc-text-shadow leading-relaxed">
            Server <span className="text-accent">Agreement</span>
          </h1>

          <p className="font-mc-body text-neutral-400 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            Accept the terms below to gain access to the RIFTSCAPE whitelist.
          </p>
        </div>

        {!user ? (
          <SignInGate description="Sign in with Discord to review and accept the server agreement." />
        ) : !profile ? (
          <NoCredentialsNotice />
        ) : (
          <AgreementForm mcUsername={profile.mc_user} />
        )}
      </div>
    </main>
  );
}
