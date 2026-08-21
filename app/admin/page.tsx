import type { Metadata } from "next";
import { BackgroundOverlay } from "@/components/layout/BackgroundOverlay";
import { SignInGate } from "@/components/auth/SignInGate";
import { AccessDenied } from "@/components/auth/AccessDenied";
import { getCurrentUser, isAdminUser } from "@/lib/auth/profile";
import { getEnrolledPlayersAdmin } from "@/lib/players";
import { getRiftscapeCoreStatus } from "@/lib/server-status";
import { SurvivorRosterList } from "@/components/admin/SurvivorRosterList";
import { ServerAPIHUD } from "@/components/admin/ServerAPIHUD";

export const metadata: Metadata = {
  title: "Admin | RIFTSCAPE",
  description: "RIFTSCAPE administration panel.",
};

export default async function AdminPage() {
  const user = await getCurrentUser();
  const admin = user ? isAdminUser(user) : false;
  const [players, status] = admin
    ? await Promise.all([getEnrolledPlayersAdmin(), getRiftscapeCoreStatus()])
    : [[], null];

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-accent/30 overflow-hidden relative pb-24">
      <BackgroundOverlay opacityClass="opacity-20" />
      <div className="relative z-10 container mx-auto px-6 pt-12">
        <h1 className="font-mc-header text-3xl sm:text-4xl text-foreground mb-4 mc-text-shadow leading-relaxed text-center">
          Admin Panel
        </h1>
        <p className="font-mc-body text-neutral-400 text-sm leading-relaxed max-w-md mx-auto mb-10 text-center">
          Welcome to the admin panel. Here you can manage various aspects of the
          application.
        </p>

        {!user ? (
          <SignInGate description="Sign in with Discord to access the admin panel." />
        ) : !admin ? (
          <AccessDenied />
        ) : (
          <>
            <ServerAPIHUD status={status} />
            <div className="mc-panel pixel-corners border-2 border-black p-6 max-w-3xl mx-auto">
              <SurvivorRosterList players={players} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
